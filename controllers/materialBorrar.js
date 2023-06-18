const material = require('../models/materiales.js');
const path = require('path');
const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");

module.exports = async (req, res) =>{


   
     await material.deleteOne({Codigo:req.params.id});


     const ProductosBorrar = await Producto.find({});

     for (i=0; i<ProductosBorrar.length;i++){

     await Producto.updateOne({_id:ProductosBorrar[i]._id},{ $pull: {MaterialesProductos: {Codigo:req.params.id} }});
     await Producto.updateOne({_id:ProductosBorrar[i]._id},{ $pull: {PinturaProductos: {Codigo:req.params.id} }});
     await Producto.updateOne({_id:ProductosBorrar[i]._id},{ $pull: {InstalacionProductos: {Codigo:req.params.id} }});


}



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

SubTotal= SubTotal.toFixed(2)

await Producto.updateOne({_id:productos[a]._id},{ $set: { precio:SubTotal } });
await Cart.update({nombre:productos[a].nombre},{$set: { precio:SubTotal } });


}
     
     
     res.redirect('/materiales/true');
}

