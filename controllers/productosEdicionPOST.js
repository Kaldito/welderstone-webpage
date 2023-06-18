const Producto = require('../models/Productos.js');
const path = require('path');
const material = require('../models/materiales.js');
const Cart = require("../models/Cart");

module.exports =  async (req,res)=>{   

  

 



    if(req.body.Familia !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Familia:req.body.Familia}});

    }

    if(req.body.descripcion !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{descripcion:req.body.descripcion}});
    }
    if(req.body.Codigo !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Codigo:req.body.Codigo}});
    }
    if(req.body.unidad !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{unidad:req.body.unidad}});
    }
    if(req.body.ManoObMaterial !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{ManoObMaterial:req.body.ManoObMaterial}});
    }
    if(req.body.PorcentajeMaterial !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{PorcentajeMaterial:req.body.PorcentajeMaterial}});
    }
    if(req.body.ManoObPintura !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{ManoObPintura:req.body.ManoObPintura}});
    }
    if(req.body.PorcentajePintura !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{PorcentajePintura:req.body.PorcentajePintura}});
    }
    if(req.body.ManoObInstalacion !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{ManoObInstalacion:req.body.ManoObInstalacion}});
    }

    if(req.body.PorcentajeInstalacion !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{PorcentajeInstalacion:req.body.PorcentajeInstalacion}});
    }
    //console.log(req.body.Activo)
    if(req.body.Activo === "true" ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Activo:true}});
    }else if(req.body.Activo !== "true"){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Activo:false}});


    }
    if(req.body.Iva !== '' ){
        const IvaEditar= Number(req.body.Iva)

        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{iva:IvaEditar}});
    }




  

    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {especificacionesNombre:1}} , {multi: true});

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {especificacionesNombre:req.body.especificacionesNombre}});      

            await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {especificacionesDesc:1}} , {multi: true});

                await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {especificacionesDesc:req.body.especificacionesDesc}});      


                await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {MaterialesProductos:1}} , {multi: true});



    for (a=1; a<req.body['MaterialesProductos[cantidad]'].length;a++){
     

     if (req.body['MaterialesProductos[cantidad]'][a]> 0){
        //console.log(req.body['MaterialesProductos[nombre]'][a])
        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $push: {MaterialesProductos:{Descripcion:req.body['MaterialesProductos[nombre]'][a],cantidad:req.body['MaterialesProductos[cantidad]'][a],Codigo:req.body['MaterialesProductos[Codigo]'][a],Familia:req.body['MaterialesProductos[Familia]'][a]}}});
    
     }
        
    }
    
    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {PinturaProductos:1}} , {multi: true});

    for (b=1; b<req.body['PinturaProductos[cantidad]'].length;b++){
        if (req.body['PinturaProductos[cantidad]'][b]> 0){
            //console.log(req.body['PinturaProductos[nombre]'][b])

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $push: {PinturaProductos:{Descripcion:req.body['PinturaProductos[nombre]'][b],cantidad:req.body['PinturaProductos[cantidad]'][b],Codigo:req.body['PinturaProductos[Codigo]'][b],Familia:req.body['PinturaProductos[Familia]'][b]}}});
        }
    }

    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {InstalacionProductos:1}} , {multi: true});

    for (c=1; c<req.body['InstalacionProductos[cantidad]'].length;c++){
        if (req.body['InstalacionProductos[cantidad]'][c]> 0){
            //console.log(req.body['InstalacionProductos[nombre]'][c])
        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $push: {InstalacionProductos:{Descripcion:req.body['InstalacionProductos[nombre]'][c],cantidad:req.body['InstalacionProductos[cantidad]'][c],Codigo:req.body['InstalacionProductos[Codigo]'][c],Familia:req.body['InstalacionProductos[Familia]'][c]}}});
        }
    }
    

    //AReglar desmadre

    const productos = await Producto.find({nombre:req.body.NombreBusqueda});

    //console.log(productos)

    const materiales = await material.find({});
    
    
    const {MaterialesProductos} = productos[0];
    const {PinturaProductos} = productos[0];
    const {InstalacionProductos} = productos[0];
    
    
    var suma = 0;
    for (let j=0; j<materiales.length; j++){

    for (let i=0; i<MaterialesProductos.length; i++){



            if (MaterialesProductos[i].Descripcion === materiales[j].Descripcion && materiales[j].PrecioUnitario >= 0 ){
             suma = suma + (MaterialesProductos[i].cantidad *  materiales[j].PrecioUnitario)
            }
    }

}
    var Suma2Mano= ((suma * productos[0].ManoObMaterial)/100) + suma;
    var Suma3Por= ((Suma2Mano * productos[0].PorcentajeMaterial)/100) +Suma2Mano;

    var sumaSolventes = 0;
    for (let j=0; j<materiales.length; j++){

    for (let i=0; i<PinturaProductos.length; i++){
            if (PinturaProductos[i].Descripcion === materiales[j].Descripcion && materiales[j].PrecioUnitario >= 0 ){
                sumaSolventes = sumaSolventes + (PinturaProductos[i].cantidad *  materiales[j].PrecioUnitario)
            }
    }
}
    var sumaSolventes2Mano= ((sumaSolventes * productos[0].ManoObPintura)/100) + sumaSolventes;
    var sumaSolventes3Por=((sumaSolventes2Mano * productos[0].PorcentajePintura)/100) +sumaSolventes2Mano;
    
    var sumaInsumos = 0;
    for (let j=0; j<materiales.length; j++){

    for (let i=0; i<InstalacionProductos.length; i++){
        if (InstalacionProductos[i].Descripcion === materiales[j].Descripcion && materiales[j].PrecioUnitario >= 0 ){
            sumaInsumos = sumaInsumos + (InstalacionProductos[i].cantidad *  materiales[j].PrecioUnitario)
        }
    }
}
    var sumaInsumos2Mano = ((sumaInsumos * productos[0].ManoObInstalacion)/100) + sumaInsumos;
    var sumaInsumos3Por = ((sumaInsumos * productos[0].PorcentajeInstalacion)/100) + sumaInsumos2Mano;
    
    var x = Suma3Por+sumaSolventes3Por+sumaInsumos3Por;
    var SubTotal=Number(x.toFixed(2))
    SubTotal = SubTotal + (SubTotal*(productos[0].iva/100))

    SubTotal= SubTotal.toFixed(2)
await Producto.updateOne({_id:productos[0]._id},{ $set: { precio:SubTotal } });
await Cart.update({nombre:productos[0].nombre},{$set: { precio:SubTotal } });

    try {


        var image = req.files.image;



        //console.log(image.name)

        image.mv(path.resolve(__dirname,'..','public/images/productos',image.name),async (error)=>{

            await Producto.updateOne({nombre:req.body.NombreBusqueda},{ $set:{ image: '/images/productos/' + image.name}});
            await Cart.update({nombre:req.body.NombreBusqueda},{ $set:{ image: '/images/productos/' + image.name}});

        })
    }
    

    catch (error) {

    }
    try {

        //console.log(productos[0].image2.length)

        if (req.body.image2 === undefined){
            await Producto.updateMany({ nombre: req.body.NombreBusqueda }, { $set: { image2: [] } });

        }

      
        if (req.body.image2 !== undefined) {
            await Producto.updateMany({ nombre: req.body.NombreBusqueda }, { $set: { image2: [] } });
            //console.log(req.body.image2);
          
            const images = Array.isArray(req.body.image2) ? req.body.image2 : [req.body.image2];
          
            await Producto.updateOne(
              { nombre: req.body.NombreBusqueda },
              { $push: { image2: { $each: images } } }
            );
          }
          


        if (req.files !== undefined) {

          const updatedFiles = req.files;
          //console.log(req.files);
      
          const images = [];
          if (Array.isArray(updatedFiles.image2)) {
            // Caso de múltiples imágenes
            for (let i = 0; i < updatedFiles.image2.length; i++) {
              let image = updatedFiles.image2[i];
              if (image.data !== null) {
                await image.mv(path.resolve(__dirname, '..', 'public/images/productos', image.name));
                images.push('/images/productos/' + image.name);
              }
            }
          } else {
            // Caso de una sola imagen
            let image = updatedFiles.image2;
            if (image.data !== null) {
              await image.mv(path.resolve(__dirname, '..', 'public/images/productos', image.name));
              images.push('/images/productos/' + image.name);
            }
          }
      
          await Producto.updateOne(
            { nombre: req.body.NombreBusqueda },
            { $push: { image2: { $each: images } } }
          );
          await Cart.update({ nombre: req.body.NombreBusqueda }, { $push: { image2: { $each: images } } });
        }
      } catch (error) {
        
      }
      

    finally {

        if(req.body.nombre !== '' ){
            await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{nombre:req.body.nombre}});
            await Cart.update({nombre:req.body.NombreBusqueda},{$set:{nombre:req.body.nombre}});
    
        }

        res.redirect('/productos')

    }
    
 
}
    


/*

        

        

*/