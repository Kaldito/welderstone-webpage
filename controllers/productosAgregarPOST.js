const Producto = require('../models/Productos.js');
const path = require('path');
const material = require('../models/materiales.js');
const AWS = require('aws-sdk');
module.exports = async (req, res) => {
    console.log(req.body)
    const BusquedaNombre = await Producto.find({
        nombre: req.body.nombre,
    }).count();
    const BusquedaCodigo = await Producto.find({
        Codigo: req.body.Codigo,
    }).count();
    if (BusquedaNombre === 0 && BusquedaCodigo === 0) {
        await Producto.create({ ...req.body });


        for (a = 0; a < req.body['MaterialesProductos[cantidad]'].length; a++) {
            if (req.body['MaterialesProductos[cantidad]'][a] > 0) {
                await Producto.updateOne(
                    { nombre: req.body.nombre },
                    {
                        $push: {
                            MaterialesProductos: {
                                Descripcion:
                                    req.body['MaterialesProductos[nombre]'][a],
                                cantidad:
                                    req.body['MaterialesProductos[cantidad]'][
                                        a
                                    ],
                                Codigo: req.body['MaterialesProductos[Codigo]'][
                                    a
                                ],
                                familia:
                                    req.body['MaterialesProductos[Familia]'][a],
                            },
                        },
                    }
                );
            }
        }

        const productos = await Producto.find({ nombre: req.body.nombre });

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


            const Suma3Por = suma

        var x = Suma3Por;
        var HerrMenor = (productos[0].ManoObGeneral * x)/100
        x = (productos[0].ManoObGeneral * x)/100+ x  
        y = (HerrMenor*  productos[0].HerramientaMenor)/100
        x= x+y
        x = (productos[0].PorcentajeGeneral * x)/100 + x


        let SubTotal = Number(x.toFixed(2));


        SubTotal = SubTotal + SubTotal * (productos[0].iva / 100);
        console.log(SubTotal)
        SubTotal = SubTotal.toFixed(2);
        await Producto.updateOne(
            { _id: productos[0]._id },
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

            const mainImage = req.files.image;
            await uploadImage(mainImage, req.body.Codigo + mainImage.name);

            await Producto.updateOne(
                { Codigo: req.body.Codigo },
                { $set: { image: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + req.body.Codigo + mainImage.name } }
            );

            const keys = Object.keys(req.files);

            const additionalImages = [];
            for (let n = 2; n < keys.length + 1; n++) {
                const image = req.files['image' + n];
                const imageName = req.body.Codigo + image.name;

                await uploadImage(image, imageName);
                additionalImages.push('https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + imageName);
            }

            await Producto.updateOne(
                { Codigo: req.body.Codigo },
                { $set: { image2: additionalImages } }
            );


        } catch (error) {
        } finally {
            res.redirect('/productos');
        }
    } else if (BusquedaNombre > 0 || BusquedaCodigo > 0) {
        console.log('ya creado');
        res.redirect('/productos');
    }
};

/*
const Producto = require('../models/Productos.js');
const path = require('path');
const material = require('../models/materiales.js');

module.exports = async (req, res) => {
    console.log(req.body)
    const BusquedaNombre = await Producto.find({
        nombre: req.body.nombre,
    }).count();
    if (BusquedaNombre === 0) {
        await Producto.create({ ...req.body });

        
    await Producto.updateOne({IdProducto: req.body.IdProducto}, {IdProducto: req.body.IdProducto.trim()})
    await Producto.updateOne({familia: req.body.familia}, {familia: req.body.familia.toLowerCase()});
 
    for (a = 0; a < req.body['MaterialesProductos[cantidad]'].length; a++) {
        if (req.body['MaterialesProductos[cantidad]'][a] > 0) {
            // console.log(req.body['MaterialesProductos[nombre]'][a])
            await Producto.updateOne(
                { nombre: req.body.nombre },
                {
                    $push: {
                        MaterialesProductos: {
                            Descripcion:
                                req.body['MaterialesProductos[nombre]'][a],
                            cantidad:
                                req.body['MaterialesProductos[cantidad]'][
                                    a
                                ],
                            Codigo: req.body['MaterialesProductos[Codigo]'][
                                a
                            ],
                            familia:
                                req.body['MaterialesProductos[Familia]'][a],
                        },
                    },
                }
            );
        }
    }

    for (b = 0; b < req.body['PinturaProductos[cantidad]'].length; b++) {
        if (req.body['PinturaProductos[cantidad]'][b] > 0) {
            // console.log(req.body['PinturaProductos[nombre]'][b])

            await Producto.updateOne(
                { nombre: req.body.nombre },
                {
                    $push: {
                        PinturaProductos: {
                            Descripcion:
                                req.body['PinturaProductos[nombre]'][b],
                            cantidad:
                                req.body['PinturaProductos[cantidad]'][b],
                            Codigo: req.body['PinturaProductos[Codigo]'][b],
                            familia:
                                req.body['PinturaProductos[Familia]'][b],
                        },
                    },
                }
            );
        }
    }

    for (
        c = 0;
        c < req.body['InstalacionProductos[cantidad]'].length;
        c++
    ) {
        if (req.body['InstalacionProductos[cantidad]'][c] > 0) {
            // console.log(req.body['InstalacionProductos[nombre]'][c])

            await Producto.updateOne(
                { nombre: req.body.nombre },
                {
                    $push: {
                        InstalacionProductos: {
                            Descripcion:
                                req.body['InstalacionProductos[nombre]'][c],
                            cantidad:
                                req.body['InstalacionProductos[cantidad]'][
                                    c
                                ],
                            Codigo: req.body[
                                'InstalacionProductos[Codigo]'
                            ][c],
                            familia:
                                req.body['InstalacionProductos[Familia]'][
                                    c
                                ],
                        },
                    },
                }
            );
        }
    }

    // Obtiene el precio

    const productos = await Producto.find({ nombre: req.body.nombre });

    const materiales = await material.find({});

    const { MaterialesProductos } = productos[0];
    //const { PinturaProductos } = productos[0];
    //const { InstalacionProductos } = productos[0];

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
    
    const Suma2Mano = (suma * productos[0].ManoObMaterial) / 100 + suma;
    const Suma3Por =
        (Suma2Mano * productos[0].PorcentajeMaterial) / 100 + Suma2Mano;
        

        const Suma3Por = suma

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
        (sumaSolventes * productos[0].ManoObPintura) / 100 + sumaSolventes;
    const sumaSolventes3Por =
        (sumaSolventes2Mano * productos[0].PorcentajePintura) / 100 +
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
        (sumaInsumos * productos[0].ManoObInstalacion) / 100 + sumaInsumos;
    const sumaInsumos3Por =
        (sumaInsumos * productos[0].PorcentajeInstalacion) / 100 +
        sumaInsumos2Mano;

    var x = Suma3Por;
    var HerrMenor = (productos[0].ManoObGeneral * x)/100
    x = (productos[0].ManoObGeneral * x)/100+ x  
    y = (HerrMenor*  productos[0].HerramientaMenor)/100
    x= x+y
    x = (productos[0].PorcentajeGeneral * x)/100 + x


    let SubTotal = Number(x.toFixed(2));


    SubTotal = SubTotal + SubTotal * (productos[0].iva / 100);
    console.log(SubTotal)
    SubTotal = SubTotal.toFixed(2);
    await Producto.updateOne(
        { _id: productos[0]._id },
        { $set: { precio: SubTotal } }
    );

    try {
        const image = req.files.image;

        image.mv(
            path.resolve(
                __dirname,
                '..',
                'public/images/productos',
                req.body.Codigo +image.name
            ),
            async (error) => {
                await Producto.updateOne(
                    { Codigo: req.body.Codigo },
                    { $set: { image: '/images/productos/' +  req.body.Codigo + image.name  } }
                );
            }
        );
    } catch (error) {}
    try {
        const keys = Object.keys(req.files);
        const length = keys.length;
        console.log(length);

        const images = [];

        for (let n = 2; n < length + 1; n++) {
            const image = req.files['image' + n];
            await image.mv(
                path.resolve(
                    __dirname,
                    '..',
                    'public/images/productos',
                    req.body.Codigo + image.name
                )
            );

            images.push('/images/productos/' + req.body.Codigo + image.name);
        }

        await Producto.updateOne(
            { Codigo: req.body.Codigo },
            { $set: { image2: images } }
        );
    } catch (error) {
    } finally {
        res.redirect('/productos');
    }
} else if (BusquedaNombre > 0) {
    console.log('ya creado');
    res.redirect('/productos');
}
};

*/
