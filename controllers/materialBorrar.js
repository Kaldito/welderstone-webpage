const Material = require('../models/materiales.js');
const Producto = require('../models/Productos.js');
const Cart = require('../models/Cart');
const path = require('path');

module.exports = async (req, res) => {
    const materialId = req.params.id;

    // **Paso 1: Eliminar el material**
    await Material.deleteOne({ _id: materialId });

    // **Paso 2: Encontrar productos afectados con selección de campos**
    const productosAfectados = await Producto.find({
        'MaterialesProductos.material': materialId
    }).select('MaterialesProductos nombre ManoObGeneral HerramientaMenor PorcentajeGeneral iva');

    // **Paso 3: Preparar operaciones de actualización**
    const productBulkOps = [];
    const cartUpdatePromises = [];

    for (const producto of productosAfectados) {
        // Filtrar el material eliminado de MaterialesProductos
        const updatedMaterialesProductos = producto.MaterialesProductos.filter(
            mp => mp.material.toString() !== materialId
        );

        // Actualizar MaterialesProductos en el producto
        productBulkOps.push({
            updateOne: {
                filter: { _id: producto._id },
                update: { $set: { MaterialesProductos: updatedMaterialesProductos } }
            }
        });

        // Poblar los materiales restantes para recalcular el precio
        await Producto.populate(producto, {
            path: 'MaterialesProductos.material',
            select: 'PrecioUnitario' // Solo necesitamos PrecioUnitario
        });

        let suma = 0;
        for (const mp of updatedMaterialesProductos) {
            const material = mp.material;
            const cantidad = mp.cantidad;
            suma += cantidad * material.PrecioUnitario;
        }

        // Cálculos adicionales para el precio
        let x = suma;
        const HerrMenor = (producto.ManoObGeneral * x) / 100;
        x = (producto.ManoObGeneral * x) / 100 + x;
        const y = (HerrMenor * producto.HerramientaMenor) / 100;
        x = x + y;
        x = (producto.PorcentajeGeneral * x) / 100 + x;

        // Calcular subtotal con IVA
        let SubTotal = Number(x.toFixed(2));
        SubTotal += SubTotal * (producto.iva / 100);
        SubTotal = SubTotal.toFixed(2);

        // Operación de actualización para el precio del producto
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

    // **Paso 4: Ejecutar actualizaciones en masa**
    if (productBulkOps.length > 0) {
        await Producto.bulkWrite(productBulkOps);
    }

    // Actualizar carritos en paralelo
    if (cartUpdatePromises.length > 0) {
        await Promise.all(cartUpdatePromises);
    }

    res.redirect('/materiales/true');
};