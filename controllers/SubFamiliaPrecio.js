const Material = require('../models/materiales.js');
const Producto = require('../models/Productos.js');
const Cart = require('../models/Cart');
const path = require('path');

module.exports = async (req, res) => {
    const { SubFamiliaPrecio, SubFamiliaPrecioEleccion, porcentaje, accion } = req.body;

    try {
        // **Validación de entrada**
        if (!SubFamiliaPrecio || !SubFamiliaPrecioEleccion || !porcentaje || !accion) {
            return res.status(400).send('Faltan parámetros requeridos');
        }
        if (porcentaje <= 0) {
            return res.status(400).send('El porcentaje debe ser mayor que 0');
        }

        let updatedMaterialIds = [];

        // **Paso 1: Actualizar precios de materiales**
        if (SubFamiliaPrecioEleccion === 'PorcentajeEleccion') {
            const factor = accion === 'incrementar' ? 1 + porcentaje / 100 : 1 - porcentaje / 100;

            await Material.updateMany(
                { SubFam: SubFamiliaPrecio },
                { $mul: { PrecioUnitario: factor } }
            );

            // Obtener IDs de materiales actualizados de manera eficiente
            updatedMaterialIds = await Material.find({ SubFam: SubFamiliaPrecio }).distinct('_id');
        } else if (SubFamiliaPrecioEleccion === 'FijoEleccion') {
            const valor = accion === 'incrementar' ? parseFloat(porcentaje) : -parseFloat(porcentaje);

            await Material.updateMany(
                { SubFam: SubFamiliaPrecio },
                { $inc: { PrecioUnitario: valor } }
            );

            updatedMaterialIds = await Material.find({ SubFam: SubFamiliaPrecio }).distinct('_id');
        } else {
            return res.status(400).send('Opción de actualización inválida');
        }

        // **Paso 2: Encontrar productos afectados**
        const productosAfectados = await Producto.find({
            'MaterialesProductos.material': { $in: updatedMaterialIds }
        }).populate({
            path: 'MaterialesProductos.material',
            select: 'PrecioUnitario' // Solo cargar el campo necesario
        });

        // **Paso 3: Recalcular precios y preparar actualizaciones**
        const bulkUpdateOperations = [];
        const cartUpdates = {};

        for (const producto of productosAfectados) {
            let suma = 0;
            // Calcular costo total de los materiales
            for (const mp of producto.MaterialesProductos) {
                const material = mp.material;
                const cantidad = mp.cantidad || 0; // Valor por defecto
                if (material && material.PrecioUnitario >= 0) {
                    suma += cantidad * material.PrecioUnitario;
                }
            }

            // Aplicar cálculos adicionales con valores por defecto
            let x = suma;
            const ManoObGeneral = producto.ManoObGeneral || 0;
            const HerramientaMenor = producto.HerramientaMenor || 0;
            const PorcentajeGeneral = producto.PorcentajeGeneral || 0;
            const iva = producto.iva || 0;

            const herrMenor = (ManoObGeneral * x) / 100;
            x = (ManoObGeneral * x) / 100 + x;
            const y = (herrMenor * HerramientaMenor) / 100;
            x = x + y;
            x = (PorcentajeGeneral * x) / 100 + x;

            // Calcular subtotal con IVA
            let subTotal = Number(x.toFixed(2));
            subTotal += subTotal * (iva / 100);
            subTotal = Number(subTotal.toFixed(2));

            // Preparar actualización del producto
            bulkUpdateOperations.push({
                updateOne: {
                    filter: { _id: producto._id },
                    update: { $set: { precio: subTotal } }
                }
            });

            // Agrupar actualizaciones del carrito por nombre
            if (producto.nombre) {
                cartUpdates[producto.nombre] = subTotal;
            }
        }

        // **Paso 4: Ejecutar actualizaciones en masa**
        if (bulkUpdateOperations.length > 0) {
            await Producto.bulkWrite(bulkUpdateOperations);
        }

        // Actualizar el carrito de forma eficiente
        for (const [nombre, precio] of Object.entries(cartUpdates)) {
            await Cart.updateMany(
                { nombre },
                { $set: { precio } }
            );
        }

        res.redirect('/materiales/true');
    } catch (error) {
        console.error('Error al actualizar precios:', error);
        res.status(500).send('Error en la actualización');
    }
};
/*

const material = require('../models/materiales.js');
const Producto = require('../models/Productos.js');
const path = require('path');
const Cart = require('../models/Cart');

module.exports = async (req, res) => {
    if (req.body.SubFamiliaPrecioEleccion === 'PorcentajeEleccion') {
        const porcentaje = req.body.porcentaje / 100 + 1;

        const porcentajeRed = 1 - req.body.porcentaje / 100;

        if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
            await material.bulkWrite([
                {
                    updateMany: {
                        filter: { SubFam: req.body.SubFamiliaPrecio },
                        update: { $mul: { PrecioUnitario: porcentaje } },
                    },
                },
            ]);
        } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
            await material.bulkWrite([
                {
                    updateMany: {
                        filter: { SubFam: req.body.SubFamiliaPrecio },
                        update: { $mul: { PrecioUnitario: porcentajeRed } },
                    },
                },
            ]);
        }

        // Obtener todos los materiales
        const materials = await material.find({
            SubFam: req.body.SubFamiliaPrecio,
        });

        // Crear una lista de operaciones de actualización
        const updateOperations = materials.map((material) => ({
            updateOne: {
                filter: { _id: material._id },
                update: {
                    $set: {
                        PrecioUnitario: Math.round(material.PrecioUnitario * 100) / 100,
                    },
                },
            },
        }));

        // Ejecutar las operaciones de actualización en masa
        await material.bulkWrite(updateOperations);
    } else if (req.body.SubFamiliaPrecioEleccion === 'FijoEleccion') {
        const ValorASumar = req.body.porcentaje;

        const ValorARestar = req.body.porcentaje;

        if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
            await material.bulkWrite([
                {
                    updateMany: {
                        filter: { SubFam: req.body.SubFamiliaPrecio },
                        update: { $inc: { PrecioUnitario: ValorASumar } },
                    },
                },
            ]);
        } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
            await material.bulkWrite([
                {
                    updateMany: {
                        filter: { SubFam: req.body.SubFamiliaPrecio },
                        update: { $inc: { PrecioUnitario: -ValorARestar } },
                    },
                },
            ]);
        }
    }

    const cantidadrespetada = await Producto.find({});

    for (let i = 0; i < cantidadrespetada.length; i++) {
        const mateprod = await material.find({});
        const { MaterialesProductos } = cantidadrespetada[i];
        for (let j = 0; j < MaterialesProductos.length; j++) {
            for (let a = 0; a < mateprod.length; a++) {
                if (
                    cantidadrespetada[i].MaterialesProductos[j].Descripcion ===
                    mateprod[a].Descripcion
                ) {
                    await Producto.bulkWrite([
                        {
                            updateOne: {
                                filter: { _id: cantidadrespetada[i]._id },
                                update: {
                                    $set: {
                                        'MaterialesProductos.$[item]': {
                                            Descripcion: mateprod[a].Descripcion,
                                            cantidad:
                                                cantidadrespetada[i].MaterialesProductos[j].cantidad,
                                            Codigo: mateprod[a].Codigo,
                                            Familia: mateprod[a].Familia,
                                        },
                                    },
                                },
                                arrayFilters: [
                                    { 'item._id': cantidadrespetada[i].MaterialesProductos[j]._id },
                                ],
                            },
                        },
                    ]);
                }
            }
        }

        const { PinturaProductos } = cantidadrespetada[i];

        for (let a = 0; a < mateprod.length; a++) {
            for (let j = 0; j < PinturaProductos.length; j++) {
                if (
                    cantidadrespetada[i].PinturaProductos[j].Descripcion ===
                    mateprod[a].Descripcion
                ) {
                    await Producto.bulkWrite([
                        {
                            updateOne: {
                                filter: { _id: cantidadrespetada[i]._id },
                                update: {
                                    $set: {
                                        'PinturaProductos.$[item]': {
                                            Descripcion: mateprod[a].Descripcion,
                                            cantidad:
                                                cantidadrespetada[i].PinturaProductos[j]
                                                    .cantidad,
                                            Codigo: mateprod[a].Codigo,
                                            familia: mateprod[a].Familia,
                                        },
                                    },
                                },
                                arrayFilters: [
                                    { 'item._id': cantidadrespetada[i].PinturaProductos[j]._id },
                                ],
                            },
                        },
                    ]);
                }
            }
        }

        const { InstalacionProductos } = cantidadrespetada[i];

        for (let a = 0; a < mateprod.length; a++) {
            for (let j = 0; j < InstalacionProductos.length; j++) {
                if (
                    cantidadrespetada[i].InstalacionProductos[j].Descripcion ===
                    mateprod[a].Descripcion
                ) {
                    await Producto.bulkWrite([
                        {
                            updateOne: {
                                filter: { _id: cantidadrespetada[i]._id },
                                update: {
                                    $set: {
                                        'InstalacionProductos.$[item]': {
                                            Descripcion: mateprod[a].Descripcion,
                                            cantidad:
                                                cantidadrespetada[i].InstalacionProductos[j]
                                                    .cantidad,
                                            Codigo: mateprod[a].Codigo,
                                            familia: mateprod[a].Familia,
                                        },
                                    },
                                },
                                arrayFilters: [
                                    {
                                        'item._id':
                                            cantidadrespetada[i].InstalacionProductos[j]._id,
                                    },
                                ],
                            },
                        },
                    ]);
                }
            }
        }
    }

    const productos = await Producto.find({});
    const materiales = await material.find({});

    const bulkUpdateOperations = [];
    for (let a = 0; a < productos.length; a++) {
        const { MaterialesProductos } = productos[a];
        const { PinturaProductos } = productos[a];
        const { InstalacionProductos } = productos[a];

        let suma = 0;
        for (let j = 0; j < materiales.length; j++) {
            for (let i = 0; i < MaterialesProductos.length; i++) {
                if (
                    MaterialesProductos[i].Descripcion ===
                    materiales[j].Descripcion &&
                    materiales[j].PrecioUnitario >= 0
                ) {
                    suma +=
                        MaterialesProductos[i].cantidad * materiales[j].PrecioUnitario;
                }
            }
        }
        const Suma2Mano = (suma * productos[a].ManoObMaterial) / 100 + suma;
        const Suma3Por =
            (Suma2Mano * productos[a].PorcentajeMaterial) / 100 + Suma2Mano;

        let sumaSolventes = 0;
        for (let j = 0; j < materiales.length; j++) {
            for (let i = 0; i < PinturaProductos.length; i++) {
                if (
                    PinturaProductos[i].Descripcion ===
                    materiales[j].Descripcion &&
                    materiales[j].PrecioUnitario >= 0
                ) {
                    sumaSolventes +=
                        PinturaProductos[i].cantidad * materiales[j].PrecioUnitario;
                }
            }
        }
        const sumaSolventes2Mano =
            (sumaSolventes * productos[a].ManoObPintura) / 100 + sumaSolventes;
        const sumaSolventes3Por =
            (sumaSolventes2Mano * productos[a].PorcentajePintura) / 100 +
            sumaSolventes2Mano;

        let sumaInsumos = 0;
        for (let j = 0; j < materiales.length; j++) {
            for (let i = 0; i < InstalacionProductos.length; i++) {
                if (
                    InstalacionProductos[i].Descripcion ===
                    materiales[j].Descripcion &&
                    materiales[j].PrecioUnitario >= 0
                ) {
                    sumaInsumos +=
                        InstalacionProductos[i].cantidad * materiales[j].PrecioUnitario;
                }
            }
        }
        const sumaInsumos2Mano =
            (sumaInsumos * productos[a].ManoObInstalacion) / 100 + sumaInsumos;
        const sumaInsumos3Por =
            (sumaInsumos * productos[a].PorcentajeInstalacion) / 100 +
            sumaInsumos2Mano;

        const x = Suma3Por + sumaSolventes3Por + sumaInsumos3Por;
        let SubTotal = Number(x.toFixed(2));
        SubTotal += SubTotal * (productos[a].iva / 100);
        SubTotal = SubTotal.toFixed(2);

        bulkUpdateOperations.push({
            updateOne: {
                filter: { _id: productos[a]._id },
                update: { $set: { precio: SubTotal } },
            },
        });

        bulkUpdateOperations.push({
            updateOne: {
                filter: { nombre: productos[a].nombre },
                update: { $set: { precio: SubTotal } },
            },
        });
    }

    // Ejecutar las operaciones de actualización en masa
    await Producto.bulkWrite(bulkUpdateOperations);

    res.redirect('/materiales/true');
};

*/
