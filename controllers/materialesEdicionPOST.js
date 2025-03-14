const Material = require('../models/materiales.js');
const Producto = require('../models/Productos.js');
const Cart = require('../models/Cart');

module.exports = async (req, res) => {
    const obj_ids = req.body.id;

    // Actualizar los materiales
    if (obj_ids !== undefined) {
        if (Array.isArray(obj_ids)) {
            // Caso de múltiples materiales con bulkWrite
            const materialBulkOps = obj_ids.map((id, i) => {
                const params = {};
                if (req.body.Descripcion && req.body.Descripcion[i] !== '') params.Descripcion = req.body.Descripcion[i];
                if (req.body.Codigo && req.body.Codigo[i] !== '') params.Codigo = req.body.Codigo[i];
                if (req.body.Unidad && req.body.Unidad[i] !== '') params.Unidad = req.body.Unidad[i];
                if (req.body.PrecioUnitario && req.body.PrecioUnitario[i] !== '') params.PrecioUnitario = parseFloat(req.body.PrecioUnitario[i]);
                if (req.body.Familia && req.body.Familia[i] !== '') params.Familia = req.body.Familia[i];
                if (req.body.SubFam && req.body.SubFam[i] !== '') params.SubFam = req.body.SubFam[i];
                return {
                    updateOne: {
                        filter: { _id: id },
                        update: { $set: params }
                    }
                };
            });
            await Material.bulkWrite(materialBulkOps);
        } else {
            // Caso de un solo material
            const params = {};
            if (req.body.Descripcion !== '') params.Descripcion = req.body.Descripcion;
            if (req.body.Codigo !== '') params.Codigo = req.body.Codigo;
            if (req.body.Unidad !== '') params.Unidad = req.body.Unidad;
            if (req.body.PrecioUnitario !== '') params.PrecioUnitario = parseFloat(req.body.PrecioUnitario);
            if (req.body.Familia !== '') params.Familia = req.body.Familia;
            if (req.body.SubFam !== '') params.SubFam = req.body.SubFam;
            if (Object.keys(params).length > 0) {
                await Material.findByIdAndUpdate(obj_ids, params);
            }
        }
    }

    // Obtener los IDs de los materiales actualizados
    const updatedMaterialIds = Array.isArray(obj_ids) ? obj_ids : [obj_ids];

    // Encontrar productos afectados
    const productosAfectados = await Producto.find({
        'MaterialesProductos.material': { $in: updatedMaterialIds }
    }).populate('MaterialesProductos.material');

    // Preparar operaciones de actualización
    const productBulkOps = [];
    const cartUpdatePromises = [];

    for (const producto of productosAfectados) {
        let suma = 0;
        for (const mp of producto.MaterialesProductos) {
            const material = mp.material;
            const cantidad = mp.cantidad;
            suma += cantidad * material.PrecioUnitario;
        }

        let x = suma;
        const HerrMenor = (producto.ManoObGeneral * x) / 100;
        x = (producto.ManoObGeneral * x) / 100 + x;
        const y = (HerrMenor * producto.HerramientaMenor) / 100;
        x = x + y;
        x = (producto.PorcentajeGeneral * x) / 100 + x;

        let SubTotal = Number(x.toFixed(2));
        SubTotal = SubTotal + SubTotal * (producto.iva / 100);
        SubTotal = SubTotal.toFixed(2);

        // Operación de actualización para el producto
        productBulkOps.push({
            updateOne: {
                filter: { _id: producto._id },
                update: { $set: { precio: SubTotal } }
            }
        });

        // Promesa de actualización para los carritos
        cartUpdatePromises.push(
            Cart.updateMany(
                { nombre: producto.nombre },
                { $set: { precio: SubTotal } }
            )
        );
    }

    // Ejecutar actualizaciones de productos en masa
    if (productBulkOps.length > 0) {
        await Producto.bulkWrite(productBulkOps);
    }

    // Ejecutar actualizaciones de carritos en paralelo
    if (cartUpdatePromises.length > 0) {
        await Promise.all(cartUpdatePromises);
    }

    res.redirect('/materiales/true');
};