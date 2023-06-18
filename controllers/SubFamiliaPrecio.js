const material = require("../models/materiales.js");
const Producto = require('../models/Productos.js');
const path = require('path');
const Cart = require("../models/Cart");


module.exports = async (req, res) =>{


    if(req.body.SubFamiliaPrecioEleccion === 'PorcentajeEleccion'){
        var porcentaje= (req.body.porcentaje/100)+1

    var porcentajeRed= 1-(req.body.porcentaje/100)



if(req.body.porcentaje >0 && req.body.accion ==='incrementar'){

    await material.updateMany({SubFam:req.body.SubFamiliaPrecio }, { $mul: { PrecioUnitario: porcentaje }});



}else if (req.body.porcentaje >0 && req.body.accion ==='reducir')
{

    await material.update({SubFam:req.body.SubFamiliaPrecio},{$mul:{PrecioUnitario:porcentajeRed}})


}

// Obtener todos los materiales
const materials = await material.find({ SubFam: req.body.SubFamiliaPrecio });

// Crear una lista de operaciones de actualización
const updateOperations = materials.map((material) => ({
  updateOne: {
    filter: { _id: material._id },
    update: { $set: { PrecioUnitario: Math.round(material.PrecioUnitario * 100) / 100 } },
  },
}));

// Ejecutar las operaciones de actualización en masa
await material.bulkWrite(updateOperations);

    }else if(req.body.SubFamiliaPrecioEleccion === 'FijoEleccion'){

var ValorASumar = req.body.porcentaje

var ValorARestar = req.body.porcentaje

if (req.body.porcentaje > 0 && req.body.accion === 'incrementar') {
    await material.updateMany({ SubFam: req.body.SubFamiliaPrecio }, { $inc: { PrecioUnitario: ValorASumar } });
  } else if (req.body.porcentaje > 0 && req.body.accion === 'reducir') {
    await material.updateMany({ SubFam: req.body.SubFamiliaPrecio }, { $inc: { PrecioUnitario: -ValorARestar } });
  }
        

    }







const cantidadrespetada = await Producto.find({});


    for (let i=0; i<cantidadrespetada.length; i++){

    
    const mateprod= await material.find({});
    const {MaterialesProductos} = cantidadrespetada[i]
        for (let j=0; j<MaterialesProductos.length; j++){

    for (let a=0; a<mateprod.length; a++){
    if(cantidadrespetada[i].MaterialesProductos[j].Descripcion ===mateprod[a].Descripcion ){
   
        await Producto.updateOne({_id:cantidadrespetada[i]._id}, { $set: {"MaterialesProductos.$[item]":{Descripcion:mateprod[a].Descripcion,cantidad:cantidadrespetada[i].MaterialesProductos[j].cantidad,Codigo:mateprod[a].Codigo,Familia:mateprod[a].Familia}}},{arrayFilters: [{"item._id":cantidadrespetada[i].MaterialesProductos[j]._id}]});
      
    }   
}
    }
    

    const {PinturaProductos} = cantidadrespetada[i]

    for (let a=0; a<mateprod.length; a++){
        for (let j=0; j<PinturaProductos.length; j++){
    if(cantidadrespetada[i].PinturaProductos[j].Descripcion === mateprod[a].Descripcion ){
    
        await Producto.updateOne({_id:cantidadrespetada[i]._id}, { $set: {"PinturaProductos.$[item]":{Descripcion:mateprod[a].Descripcion,cantidad:cantidadrespetada[i].PinturaProductos[j].cantidad,Codigo:mateprod[a].Codigo,familia:mateprod[a].Familia}}},{arrayFilters: [{"item._id":cantidadrespetada[i].PinturaProductos[j]._id}]});
      
    }   
}
    }
    


    const {InstalacionProductos} = cantidadrespetada[i]

    for (let a=0; a<mateprod.length; a++){
        for (let j=0; j<InstalacionProductos.length; j++){

    if(cantidadrespetada[i].InstalacionProductos[j].Descripcion ===mateprod[a].Descripcion ){
    
        await Producto.updateOne({_id:cantidadrespetada[i]._id}, { $set: {"InstalacionProductos.$[item]":{Descripcion:mateprod[a].Descripcion,cantidad:cantidadrespetada[i].InstalacionProductos[j].cantidad,Codigo:mateprod[a].Codigo,familia:mateprod[a].Familia}}},{arrayFilters: [{"item._id":cantidadrespetada[i].InstalacionProductos[j]._id}]});
      
    }   
}
    }
    }
    
//await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {"MaterialesProductos.$[item]":{Descripcion:req.body['MaterialesProductos[nombre]'][a],cantidad:req.body['MaterialesProductos[cantidad]'][a],Codigo:req.body['MaterialesProductos[Codigo]'][a],Familia:req.body['MaterialesProductos[Familia]'][a]}}}, {arrayFilters: [{"item.Codigo":req.body['MaterialesProductos[Codigo]'][a]}]});


const productos = await Producto.find({});
const materiales = await material.find({});

for (let a =0; a< productos.length; a++){

const {MaterialesProductos} = productos[a];
const {PinturaProductos} = productos[a];
const {InstalacionProductos} = productos[a];


var suma = 0;
for (let j=0; j<materiales.length; j++){

for (let i=0; i<MaterialesProductos.length; i++){
        if (MaterialesProductos[i].Descripcion === materiales[j].Descripcion && materiales[j].PrecioUnitario >= 0 ){
         suma = suma + (MaterialesProductos[i].cantidad *  materiales[j].PrecioUnitario)
        }
}

}
var Suma2Mano= ((suma * productos[a].ManoObMaterial)/100) + suma;
var Suma3Por= ((Suma2Mano * productos[a].PorcentajeMaterial)/100) +Suma2Mano;

var sumaSolventes = 0;
for (let j=0; j<materiales.length; j++){

for (let i=0; i<PinturaProductos.length; i++){
        if (PinturaProductos[i].Descripcion === materiales[j].Descripcion && materiales[j].PrecioUnitario >= 0 ){
            sumaSolventes = sumaSolventes + (PinturaProductos[i].cantidad *  materiales[j].PrecioUnitario)
        }
}
}
var sumaSolventes2Mano= ((sumaSolventes * productos[a].ManoObPintura)/100) + sumaSolventes;
var sumaSolventes3Por=((sumaSolventes2Mano * productos[a].PorcentajePintura)/100) +sumaSolventes2Mano;

var sumaInsumos = 0;
for (let j=0; j<materiales.length; j++){

for (let i=0; i<InstalacionProductos.length; i++){
    if (InstalacionProductos[i].Descripcion === materiales[j].Descripcion && materiales[j].PrecioUnitario >= 0 ){
        sumaInsumos = sumaInsumos + (InstalacionProductos[i].cantidad *  materiales[j].PrecioUnitario)
    }
}
}
var sumaInsumos2Mano = ((sumaInsumos * productos[a].ManoObInstalacion)/100) + sumaInsumos;
var sumaInsumos3Por = ((sumaInsumos * productos[a].PorcentajeInstalacion)/100) + sumaInsumos2Mano;

var x = Suma3Por+sumaSolventes3Por+sumaInsumos3Por;
var SubTotal=Number(x.toFixed(2))
SubTotal = SubTotal + (SubTotal*(productos[a].iva/100))

SubTotal = SubTotal.toFixed(2)

await Producto.updateOne({_id:productos[a]._id},{ $set: { precio:SubTotal } });
await Cart.update({nombre:productos[a].nombre},{$set: { precio:SubTotal } });


}









res.redirect('/materiales/true')
}



/*


module.exports = async (req, res) =>{
    var porcentaje= (req.body.porcentaje/100)+1

    var porcentajeRed= 1-(req.body.porcentaje/100)



if(req.body.porcentaje >0 && req.body.accion ==='incrementar'){

    await material.updateMany({SubFam:req.body.SubFamiliaPrecio }, { $mul: { PrecioUnitario: porcentaje }});



}else if (req.body.porcentaje >0 && req.body.accion ==='reducir')
{

    await material.update({SubFam:req.body.SubFamiliaPrecio},{$mul:{PrecioUnitario:porcentajeRed}})

}
*/