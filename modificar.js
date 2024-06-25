const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON
const inputFilePath = path.join(__dirname, 'productosFinal.json'); // Reemplaza 'input.json' con el nombre de tu archivo JSON de entrada
const outputFilePath = path.join(__dirname, 'productos.json'); // Reemplaza 'output.json' con el nombre de tu archivo JSON de salida

// Leer el archivo JSON
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Parsear el contenido del archivo JSON
  let documents = JSON.parse(data);

  // Procesar cada documento
  documents = documents.map(doc => {
    if (doc._id && typeof doc._id === 'string') {
      // Asignar el nuevo campo "enlace"
      doc.enlace = "welderstone.com/productos/" + doc._id;
    } else if (doc._id && doc._id.$oid) {
      // Extraer el valor de _id.$oid
      const idValue = doc._id.$oid;

      // Eliminar el campo _id actual
      delete doc._id;

      // Asignar el valor extraído a un nuevo campo _id
      doc._id = idValue;

      // Agregar el nuevo campo "enlace"
      doc.enlace = "welderstone.com/productos/" + idValue;
    }
    return doc;
  });

  // Escribir el archivo JSON modificado
  fs.writeFile(outputFilePath, JSON.stringify(documents, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error al escribir el archivo JSON:', err);
      return;
    }
    console.log('Archivo JSON modificado guardado en', outputFilePath);
  });
});
