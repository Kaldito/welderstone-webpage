var express = require ('express');
var router =express.Router();
const CarruselImagenes = require('../models/CarruselImagenes');
const AWS = require('aws-sdk');

router.get('/CarruselImagenes',async (req,res,next)=>{
    const Carrusel = await CarruselImagenes.find({})
    //console.log(Carrusel)
    let role = "viewer";
    let logged = false; 
    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
        logged = true;
        var IdUsuario = req.session.passport.user.id;
    }
    if (
        role == 'admin'
    ) {

    res.render('CarruselImagenes',{roles: role,loggedIn: true,Carrusel})

    }else{
        res.redirect('/')
    }
});
/*
router.post('/CarruselAgregar',async(req,res,nex)=>{



    console.log("hola")


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

        await uploadImage(mainImage, "carrusel"+mainImage.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel" + mainImage.name } })



        const uploadImage2 = async (image2, key) => {
            const uploadParams2 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image2.data,
            };

            await s3.upload(uploadParams2).promise();
        };

        const mainImage2 = req.files.image2;

        await uploadImage2(mainImage2, "carrusel2"+mainImage2.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image2: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel2" + mainImage2.name } })

      
        const uploadImage3 = async (image3, key) => {
            const uploadParams3 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image3.data,
            };

            await s3.upload(uploadParams3).promise();
        };

        const mainImage3 = req.files.image3;

        await uploadImage3(mainImage3, "carrusel3"+mainImage3.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image3: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel3" + mainImage3.name } })

        const uploadImage4 = async (image4, key) => {
            const uploadParams4 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image4.data,
            };

            await s3.upload(uploadParams4).promise();
        };

        const mainImage4 = req.files.image4;

        await uploadImage4(mainImage4, "carrusel4"+mainImage4.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image4: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel4" + mainImage4.name } })

        const uploadImage5 = async (image5, key) => {
            const uploadParams5 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image5.data,
            };

            await s3.upload(uploadParams5).promise();
        };

        const mainImage5 = req.files.image5;

        await uploadImage5(mainImage5, "carrusel5"+mainImage5.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image5: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel5" + mainImage5.name } })


        const uploadImage6 = async (image6, key) => {
            const uploadParams6 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image6.data,
            };

            await s3.upload(uploadParams6).promise();
        };

        const mainImage6 = req.files.image6;

        await uploadImage6(mainImage6, "carrusel6"+mainImage6.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image6: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel6" + mainImage6.name } })



        const uploadImage7 = async (image7, key) => {
            const uploadParams7 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image7.data,
            };

            await s3.upload(uploadParams7).promise();
        };

        const mainImage7 = req.files.image7;

        await uploadImage7(mainImage7, "carrusel7"+mainImage7.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image7: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel7" + mainImage7.name } })


        const uploadImage8 = async (image8, key) => {
            const uploadParams8 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image8.data,
            };

            await s3.upload(uploadParams8).promise();
        };

        const mainImage8 = req.files.image8;

        await uploadImage8(mainImage8, "carrusel8"+mainImage8.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image8: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel8" + mainImage8.name } })


        const uploadImage9 = async (image9, key) => {
            const uploadParams9 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image9.data,
            };

            await s3.upload(uploadParams9).promise();
        };

        const mainImage9 = req.files.image9;

        await uploadImage9(mainImage9, "carrusel9"+mainImage9.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image9: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel9" + mainImage9.name } })

        const uploadImage10 = async (image10, key) => {
            const uploadParams10 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image10.data,
            };

            await s3.upload(uploadParams10).promise();
        };

        const mainImage10 = req.files.image10;

        await uploadImage10(mainImage10, "carrusel10"+mainImage10.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image10: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel10" + mainImage10.name } })

        const uploadImage11 = async (image11, key) => {
            const uploadParams11 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image11.data,
            };

            await s3.upload(uploadParams11).promise();
        };

        const mainImage11 = req.files.image11;

        await uploadImage11(mainImage11, "carrusel11"+mainImage11.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image11: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel11" + mainImage11.name } })

        
        const uploadImage12 = async (image12, key) => {
            const uploadParams12 = {
                Bucket: 'welderstonebucket', // Reemplaza con el nombre de tu bucket en AWS S3
                Key: 'Imagenes/' + key,
                Body: image12.data,
            };

            await s3.upload(uploadParams12).promise();
        };

        const mainImage12 = req.files.image12;

        await uploadImage12(mainImage12, "carrusel12"+mainImage12.name);
        await CarruselImagenes.updateOne({carrusel:"aaron"},{ $set: { image12: 'https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/' + "carrusel12" + mainImage12.name } })

        }catch(error){
        res.redirect('/CarruselImagenes/CarruselImagenes')
    }



})

*/
router.post('/CarruselAgregar', async (req, res, next) => {
    console.log("hola");

    AWS.config.update({
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    });

    const s3 = new AWS.S3();

    try {
        const uploadImage = async (image, key) => {
            const uploadParams = {
                Bucket: 'welderstonebucket',
                Key: 'Imagenes/' + key,
                Body: image.data,
            };
            await s3.upload(uploadParams).promise();
        };

        const updateImage = async (imageKey, imageFileName) => {
            const mainImage = req.files[imageKey];

            if (mainImage) {
                await uploadImage(mainImage, imageFileName);
                await CarruselImagenes.updateOne(
                    { carrusel: "aaron" },
                    {
                        $set: {
                            [imageKey]: `https://welderstonebucket.s3.us-west-1.amazonaws.com/Imagenes/${imageFileName}`,
                        },
                    }
                );
            }
        };

        const imageKeys = [
            "image",
            "image2",
            "image3",
            "image4",
            "image5",
            "image6",
            "image7",
            "image8",
            "image9",
            "image10",
            "image11",
            "image12",
        ];

        for (const key of imageKeys) {
            await updateImage(key, `carrusel${imageKeys.indexOf(key) + 1}`);
        }
        res.redirect('/CarruselImagenes/CarruselImagenes');

    } catch (error) {
        res.redirect('/CarruselImagenes/CarruselImagenes');
    }
});
module.exports = router;