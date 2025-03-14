
/*
const Material = require('../models/materiales.js');
const mongoose = require('mongoose');

const XLSX = require('xlsx');

mongoose.connect('mongodb://localhost:27017/Woolderstone', {
    useNewUrlParser: true,
});

const ExcelAJSON = () => {
    const excel = XLSX.readFile(
        'C:\\Users\\mraar\\Desktop\\weldesrtone-main\\prueba.xlsx'
    );
    const nombreHoja = excel.SheetNames;
    const datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]], {
        cellDates: true,
    });
    console.log(datos);

    Material.create(datos);
};

ExcelAJSON();
*/
const mongoose = require('mongoose');
const Producto = require('../models/Productos.js'); // Ajusta la ruta a tu modelo de Producto
const Material = require('../models/materiales.js'); // Ajusta la ruta a tu modelo de Material

// Conexión a la base de datos
mongoose.connect('mongodb+srv://NoLeDeboANadie:rickygei@noledeboanadie.i6p3wc9.mongodb.net/Woolderstone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function migrarProductosAntiguos() {
    try {
        // Buscar productos antiguos que tengan 'Descripcion' en MaterialesProductos
        const productosAntiguos = await Producto.find({
            'MaterialesProductos.Descripcion': { $exists: true }
        });

        console.log(`Productos antiguos encontrados: ${productosAntiguos.length}`);

        for (const producto of productosAntiguos) {
            const nuevosMaterialesProductos = [];

            for (const mp of producto.MaterialesProductos) {
                // Buscar el material en la colección Material usando la Descripcion
                const material = await Material.findOne({ Descripcion: mp.Descripcion });

                if (material) {
                    // Crear el nuevo objeto con solo 'material' (_id) y 'cantidad'
                    nuevosMaterialesProductos.push({
                        material: material._id,
                        cantidad: mp.cantidad
                    });
                } else {
                    console.warn(`Material no encontrado para Descripcion: ${mp.Descripcion} en producto: ${producto.nombre}`);
                }
            }

            // Actualizar el array MaterialesProductos con la nueva estructura
            producto.MaterialesProductos = nuevosMaterialesProductos;
            await producto.save();
            console.log(`Producto actualizado: ${producto.nombre}`);
        }

        console.log('Migración completada con éxito');
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await mongoose.disconnect();
        console.log('Conexión a MongoDB cerrada');
    }
}

// Ejecutar la migración
migrarProductosAntiguos();