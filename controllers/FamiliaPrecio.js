const material = require('../models/materiales.js');
const Producto = require('../models/Productos.js');
const path = require('path');
const Cart = require('../models/Cart');

module.exports = async (req, res) => {
    console.log(req.body);

    // 1. Actualizar los precios de los materiales
    if (req.body.FamiliaPrecioEleccion === 'PorcentajeEleccion') {
        const porcentaje = req.body.porcentaje / 100 + 1;
        const porcentajeRed = 1 - req.body.porcentaje / 100;

        if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $mul: { PrecioUnitario: porcentaje } }
            );
        } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $mul: { PrecioUnitario: porcentajeRed } }
            );
        }
    } else if (req.body.FamiliaPrecioEleccion === 'FijoEleccion') {
        const valor = Number(req.body.porcentaje);

        if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $inc: { PrecioUnitario: valor } }
            );
        } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $inc: { PrecioUnitario: -valor } }
            );
        }
    }

    // Redondear precios de materiales
    const materials = await material.find({ Familia: req.body.FamiliaPrecio });
    const materialUpdateOperations = materials.map(mat => ({
        updateOne: {
            filter: { _id: mat._id },
            update: { $set: { PrecioUnitario: Math.round(mat.PrecioUnitario * 100) / 100 } }
        }
    }));
    await material.bulkWrite(materialUpdateOperations);

    // 2. Actualizar los productos afectados
    // Obtener los IDs de los materiales actualizados
    const updatedMaterialIds = materials.map(mat => mat._id);

    // Encontrar productos que usan esos materiales y poblar los datos de materiales
    const affectedProducts = await Producto.find({
        'MaterialesProductos.material': { $in: updatedMaterialIds }
    }).populate('MaterialesProductos.material', 'PrecioUnitario');

    // Preparar operaciones de actualización para los productos
    const bulkUpdateOperations = affectedProducts.map(product => {
        // Calcular la suma de los costos de los materiales
        let suma = 0;
        product.MaterialesProductos.forEach(mp => {
            if (mp.material && mp.material.PrecioUnitario >= 0) {
                suma += mp.cantidad * mp.material.PrecioUnitario;
            }
        });

        // Aplicar lógica de negocio para calcular el precio final
        let precioFinal = suma;
        let x = precioFinal;

        // Mano de obra general y herramienta menor
        const herrMenor = (product.ManoObGeneral * x) / 100;
        x = (product.ManoObGeneral * x) / 100 + x;
        const y = (herrMenor * (product.HerramientaMenor || 0)) / 100;
        x = x + y;

        // Porcentaje general
        x = (product.PorcentajeGeneral * x) / 100 + x;

        // Subtotal con IVA
        let subTotal = Number(x.toFixed(2));
        subTotal += subTotal * (product.iva / 100);
        precioFinal = Number(subTotal.toFixed(2));

        // Operación de actualización
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $set: { precio: precioFinal } }
            }
        };
    });

    // Ejecutar actualización en masa
    if (bulkUpdateOperations.length > 0) {
        await Producto.bulkWrite(bulkUpdateOperations);
    }

    res.redirect('/materiales/true');
};

/*
const material = require('../models/materiales.js');
const Producto = require('../models/Productos.js');
const path = require('path');
const Cart = require('../models/Cart');

module.exports = async (req, res) => {
    console.log(req.body);
    if (req.body.FamiliaPrecioEleccion === 'PorcentajeEleccion') {
        const porcentaje = req.body.porcentaje / 100 + 1;

        const porcentajeRed = 1 - req.body.porcentaje / 100;

        if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $mul: { PrecioUnitario: porcentaje } }
            );
        } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
            await material.update(
                { Familia: req.body.FamiliaPrecio },
                { $mul: { PrecioUnitario: porcentajeRed } }
            );
        }

        // Obtener todos los materiales
        const materials = await material.find({
            Familia: req.body.FamiliaPrecio,
        });

        // Crear una lista de operaciones de actualización
        const updateOperations = materials.map((material) => ({
            updateOne: {
                filter: { _id: material._id },
                update: {
                    $set: {
                        PrecioUnitario:
                            Math.round(material.PrecioUnitario * 100) / 100,
                    },
                },
            },
        }));

        // Ejecutar las operaciones de actualización en masa
        await material.bulkWrite(updateOperations);
    } else if (req.body.FamiliaPrecioEleccion === 'FijoEleccion') {
        const ValorASumar = req.body.porcentaje;

        const ValorARestar = req.body.porcentaje;

        if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $inc: { PrecioUnitario: ValorASumar } }
            );
        } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
            await material.updateMany(
                { Familia: req.body.FamiliaPrecio },
                { $inc: { PrecioUnitario: -ValorARestar } }
            );
        }
        const materials = await material.find({
            Familia: req.body.FamiliaPrecio,
        });

        // Crear una lista de operaciones de actualización
        const updateOperations = materials.map((material) => ({
            updateOne: {
                filter: { _id: material._id },
                update: {
                    $set: {
                        PrecioUnitario:
                            Math.round(material.PrecioUnitario * 100) / 100,
                    },
                },
            },
        }));
        // Ejecutar las operaciones de actualización en masa
        await material.bulkWrite(updateOperations);
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
                    await Producto.updateOne(
                        { _id: cantidadrespetada[i]._id },
                        {
                            $set: {
                                'MaterialesProductos.$[item]': {
                                    Descripcion: mateprod[a].Descripcion,
                                    cantidad:
                                        cantidadrespetada[i]
                                            .MaterialesProductos[j].cantidad,
                                    Codigo: mateprod[a].Codigo,
                                    Familia: mateprod[a].Familia,
                                },
                            },
                        },
                        {
                            arrayFilters: [
                                {
                                    'item._id':
                                        cantidadrespetada[i]
                                            .MaterialesProductos[j]._id,
                                },
                            ],
                        }
                    );
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
                    await Producto.updateOne(
                        { _id: cantidadrespetada[i]._id },
                        {
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
                        {
                            arrayFilters: [
                                {
                                    'item._id':
                                        cantidadrespetada[i].PinturaProductos[j]
                                            ._id,
                                },
                            ],
                        }
                    );
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
                    await Producto.updateOne(
                        { _id: cantidadrespetada[i]._id },
                        {
                            $set: {
                                'InstalacionProductos.$[item]': {
                                    Descripcion: mateprod[a].Descripcion,
                                    cantidad:
                                        cantidadrespetada[i]
                                            .InstalacionProductos[j].cantidad,
                                    Codigo: mateprod[a].Codigo,
                                    familia: mateprod[a].Familia,
                                },
                            },
                        },
                        {
                            arrayFilters: [
                                {
                                    'item._id':
                                        cantidadrespetada[i]
                                            .InstalacionProductos[j]._id,
                                },
                            ],
                        }
                    );
                }
            }
        }
    }

    // await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {"MaterialesProductos.$[item]":{Descripcion:req.body['MaterialesProductos[nombre]'][a],cantidad:req.body['MaterialesProductos[cantidad]'][a],Codigo:req.body['MaterialesProductos[Codigo]'][a],Familia:req.body['MaterialesProductos[Familia]'][a]}}}, {arrayFilters: [{"item.Codigo":req.body['MaterialesProductos[Codigo]'][a]}]});

    const productos = await Producto.find({});
    const materiales = await material.find({});

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
                    suma =
                        suma +
                        MaterialesProductos[i].cantidad *
                            materiales[j].PrecioUnitario;
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
                    sumaSolventes =
                        sumaSolventes +
                        PinturaProductos[i].cantidad *
                            materiales[j].PrecioUnitario;
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
                    sumaInsumos =
                        sumaInsumos +
                        InstalacionProductos[i].cantidad *
                            materiales[j].PrecioUnitario;
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
        SubTotal = SubTotal + SubTotal * (productos[a].iva / 100);

        SubTotal = SubTotal.toFixed(2);

        await Producto.updateOne(
            { _id: productos[a]._id },
            { $set: { precio: SubTotal } }
        );
        await Cart.update(
            { nombre: productos[a].nombre },
            { $set: { precio: SubTotal } }
        );
    }

    res.redirect('/materiales/true');
};

*/