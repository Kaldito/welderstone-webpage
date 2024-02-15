const Producto = require('../models/Productos.js');
const path = require('path');
const material = require('../models/materiales.js');
const Cart = require('../models/Cart');
const AWS = require('aws-sdk');

module.exports = async (req, res) => {
    //console.log(req.body)


    const body = {...req.body}
      
      
      // Function to merge and order specifications
      function mergeAndOrderSpecifications(body) {
        // Extract dynamic specifications
        const dynamicNames = {};
        const dynamicDescs = {};
      
        Object.keys(body).forEach(key => {
          if (key.startsWith('hiddenEspecificacionesNombre[')) {
            const index = key.match(/\[(.*?)\]/)[1];
            dynamicNames[index] = body[key];
          } else if (key.startsWith('hiddenEspecificacionesDesc[')) {
            const index = key.match(/\[(.*?)\]/)[1];
            dynamicDescs[index] = body[key];
          }
        });
      
        // Sort and merge dynamic specifications with existing ones
        const indices = Object.keys(dynamicNames).sort((a, b) => a - b);
      
        indices.forEach(index => {
          if (dynamicNames[index] && dynamicDescs[index]) {
            body.especificacionesNombre.push(dynamicNames[index]);
            body.especificacionesDesc.push(dynamicDescs[index]);
          }
        });
      
        return body;
    }

      
      // Apply function to req.body
      const mergedBody = mergeAndOrderSpecifications(body);
      
      console.log(mergedBody.especificacionesNombre);





    if (req.body.Familia !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { Familia: req.body.Familia } }
        );
    }

    if (req.body.descripcion !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { descripcion: req.body.descripcion } }
        );
    }
    if (req.body.Codigo !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { Codigo: req.body.Codigo } }
        );
    }
    if (req.body.unidad !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { unidad: req.body.unidad } }
        );
    }

    if (req.body.ManoObGeneral !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { ManoObGeneral: req.body.ManoObGeneral } }
        );
    }
    if (req.body.HerramientaMenor !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { HerramientaMenor: req.body.HerramientaMenor } }
        );
    }

    if (req.body.PorcentajeGeneral !== '') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { PorcentajeGeneral: req.body.PorcentajeGeneral } }
        );
    }

    // console.log(req.body.Activo)
    if (req.body.Activo === 'true') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { Activo: true } }
        );
    } else if (req.body.Activo !== 'true') {
        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { Activo: false } }
        );
    }
    if (req.body.Iva !== '') {
        const IvaEditar = Number(req.body.Iva);

        await Producto.updateOne(
            { _id: req.body.id },
            { $set: { iva: IvaEditar } }
        );
    }

    await Producto.updateOne(
        { _id: req.body.id },
        { $unset: { especificacionesNombre: 1 } },
        { multi: true }
    );

    await Producto.updateOne(
        { _id: req.body.id },
        { $set: { especificacionesNombre: req.body.especificacionesNombre } }
    );

    await Producto.updateOne(
        { _id: req.body.id },
        { $unset: { especificacionesDesc: 1 } },
        { multi: true }
    );

    await Producto.updateOne(
        { _id: req.body.id },
        { $set: { especificacionesDesc: req.body.especificacionesDesc } }
    );

    await Producto.updateOne(
        { _id: req.body.id },
        { $unset: { MaterialesProductos: 1 } },
        { multi: true }
    );

    for (a = 1; a < req.body['MaterialesProductos[cantidad]'].length; a++) {
        if (req.body['MaterialesProductos[cantidad]'][a] > 0) {
            // console.log(req.body['MaterialesProductos[nombre]'][a])
            await Producto.updateOne(
                { _id: req.body.id },
                {
                    $push: {
                        MaterialesProductos: {
                            Descripcion:
                                req.body['MaterialesProductos[nombre]'][a],
                            cantidad:
                                req.body['MaterialesProductos[cantidad]'][a],
                            Codigo: req.body['MaterialesProductos[Codigo]'][a],
                            Familia:
                                req.body['MaterialesProductos[Familia]'][a],
                        },
                    },
                }
            );
        }
    }

    // AReglar desmadre

    const productos = await Producto.find({ _id: req.body.id });

    // console.log(productos)

    const materiales = await material.find({});

    const { MaterialesProductos } = productos[0];

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

const Suma3Por = suma;

    var x = Suma3Por 
    var HerrMenor = (productos[0].ManoObGeneral * x)/100
    x = (productos[0].ManoObGeneral * x)/100+ x  
    y = (HerrMenor*  productos[0].HerramientaMenor)/100
    x= x+y
    x = (productos[0].PorcentajeGeneral * x)/100 + x

    
    let SubTotal = Number(x.toFixed(2));
    SubTotal = SubTotal + SubTotal * (productos[0].iva / 100);

    SubTotal = SubTotal.toFixed(2);
    await Producto.updateOne(
        { _id: productos[0]._id },
        { $set: { precio: SubTotal } }
    );
    await Cart.update(
        { nombre: productos[0].nombre },
        { $set: { precio: SubTotal } }
    );

   AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
});

const s3 = new AWS.S3();

try {
    const uploadImage = async (image, key) => {
        const uploadParams = {
            Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
            Key: 'Imagenes/' + key,
            Body: image.data,
        };

        await s3.upload(uploadParams).promise();
    };

    const image = req.files.image;
    const imageKey = req.body.id + image.name;

    await uploadImage(image, imageKey);

    await Producto.updateOne(
        { _id: req.body.id },
        { $set: { image: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + imageKey } }
    );
    await Cart.update(
        { _id: req.body.id },
        { $set: { image: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + imageKey } }
    );
}catch (error) {}
//Segundo try
try {

    //console.log(req.body.image2)
    if (req.body.image2 === undefined) {
        await Producto.updateMany(
            { _id: req.body.id },
            { $set: { image2: [] } }
        );
    }

    if (req.body.image2 !== undefined) {
        await Producto.updateMany(
            { _id: req.body.id },
            { $set: { image2: [] } }
        );
        const images = Array.isArray(req.body.image2)
            ? req.body.image2
            : [req.body.image2];

        await Producto.updateOne(
            { _id: req.body.id },
            { $push: { image2: { $each: images } } }
        );
    }

    if (req.files !== undefined) {
        const updatedFiles = req.files;
        const images = [];
        
        if (Array.isArray(updatedFiles.image2)) {
            // Multiple images
            for (let i = 0; i < updatedFiles.image2.length; i++) {
                const image = updatedFiles.image2[i];
                if (image.data !== null) {
                    const imageKey = req.body.id + image.name;
                    const uploadParams = {
                        Bucket: 'welderstonebucket',
                        Key: 'Imagenes/' + imageKey,
                        Body: image.data,
                    };
                    await s3.upload(uploadParams).promise();
                    images.push(
                        'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + imageKey
                    );
                }
            }
        } else {
            // Single image
            const image = updatedFiles.image2;
            if (image.data !== null) {
                const imageKey = req.body.id + image.name;
                const uploadParams = {
                    Bucket: 'welderstonebucket',
                    Key: 'Imagenes/' + imageKey,
                    Body: image.data,
                };
                await s3.upload(uploadParams).promise();
                images.push(
                    'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + imageKey
                );
            }
        }

        await Producto.updateOne(
            { _id: req.body.id },
            { $push: { image2: { $each: images } } }
        );
        await Cart.update(
            { _id: req.body.id },
            { $push: { image2: { $each: images } } }
        );
    }

}catch (error) {
    } finally {
        if (req.body.nombre !== '') {
            await Producto.updateOne(
                { _id: req.body.id },
                { $set: { nombre: req.body.nombre } }
            );
            await Cart.update(
                { _id: req.body.id },
                { $set: { nombre: req.body.nombre } }
            );
        }

        res.redirect('/productos');
    }
};






/*

*/
