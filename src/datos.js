
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
const Producto = require('../models/Productos.js'); // Ajusta la ruta según tu proyecto
const Material = require('../models/materiales.js'); // Ajusta la ruta según tu proyecto

// Conexión a la base de datos
mongoose.connect('mongodb+srv://NoLeDeboANadie:rickygei@noledeboanadie.i6p3wc9.mongodb.net/Prueba', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
});

// Función para procesar cada producto
async function procesarProducto(producto, materialMap) {
    try {
        // Obtener códigos y cantidades de la estructura antigua
        const codigos = producto['MaterialesProductos[Codigo]'] || [];
        const cantidades = producto['MaterialesProductos[cantidad]'] || [];

        // Crear el nuevo array de MaterialesProductos
        const nuevosMaterialesProductos = [];
        codigos.forEach((codigo, index) => {
            const cantidad = parseFloat(cantidades[index]); // Convertir a número
            if (codigo && cantidad > 0) { // Solo incluir si hay código y cantidad válida
                const materialId = materialMap[codigo];
                if (materialId) {
                    nuevosMaterialesProductos.push({
                        material: materialId,
                        cantidad: cantidad
                    });
                } else {
                    console.warn(`Material con código ${codigo} no encontrado para el producto ${producto._id}`);
                }
            }
        });

        // Reemplazar el array MaterialesProductos existente con el nuevo
        producto.MaterialesProductos = nuevosMaterialesProductos;

        // Guardar el producto actualizado
        await producto.save();
        console.log(`Producto ${producto._id} actualizado correctamente`);
    } catch (err) {
        console.error(`Error al actualizar el producto ${producto._id}:`, err);
    }
}

// Función principal para ejecutar la actualización
async function actualizarProductos() {
    try {
        // Paso 1: Cargar todos los materiales en un mapa (código -> ObjectId)
        const materiales = await Material.find({}).lean();
        const materialMap = {};
        materiales.forEach(material => {
            materialMap[material.Codigo] = material._id;
        });
        console.log('Mapa de materiales cargado con éxito');

        // Paso 2: Obtener todos los productos
        const productos = await Producto.find({});

        // Paso 3: Procesar cada producto
        for (const producto of productos) {
            await procesarProducto(producto, materialMap);
        }

        console.log('Actualización masiva completada');
    } catch (err) {
        console.error('Error en la actualización masiva:', err);
    } finally {
        // Cerrar la conexión a la base de datos
        mongoose.connection.close();
    }
}

// Ejecutar la actualización
actualizarProductos();