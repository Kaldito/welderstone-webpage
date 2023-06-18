const Producto = require('../models/Productos.js');
const path = require('path');
const Material = require('../models/materiales.js');
const Cart = require("../models/Cart");

module.exports = async (req,res)=>{   





for (a=0; a<req.body['MaterialesProductos[cantidad]'].length;a++){


    await Producto.updateOne({nombre:req.body.ProductoAEditar}, { $set: {"MaterialesProductos.$[item]":{Descripcion:req.body['MaterialesProductos[nombre]'][a],cantidad:req.body['MaterialesProductos[cantidad]'][a],codigo:req.body['MaterialesProductos[codigo]'][a],familia:req.body['MaterialesProductos[familia]'][a]}}}, {arrayFilters: [{"item.codigo":req.body['MaterialesProductos[codigo]'][a]}]});


    
}


for (b=0; b<req.body['PinturaProductos[cantidad]'].length;b++){
    await Producto.updateOne({nombre:req.body.ProductoAEditar}, { $set: {"PinturaProductos.$[item]":{Descripcion:req.body['PinturaProductos[nombre]'][b],cantidad:req.body['PinturaProductos[cantidad]'][b],codigo:req.body['PinturaProductos[codigo]'][b],familia:req.body['PinturaProductos[familia]'][b]}}}, {arrayFilters: [{"item.codigo":req.body['PinturaProductos[codigo]'][b]}]});

}

for (c=0; c<req.body['InstalacionProductos[cantidad]'].length;c++){
    await Producto.updateOne({nombre:req.body.ProductoAEditar}, { $set: {"InstalacionProductos.$[item]":{Descripcion:req.body['InstalacionProductos[nombre]'][c],cantidad:req.body['InstalacionProductos[cantidad]'][c],codigo:req.body['InstalacionProductos[codigo]'][c],familia:req.body['InstalacionProductos[familia]'][c]}}}, {arrayFilters: [{"item.codigo":req.body['InstalacionProductos[codigo]'][c]}]});

}

const productos = await Producto.find({});
const materiales = await Material.find({});

for (let a =0; a< productos.length; a++){

const {MaterialesProductos} = productos[a];
const {PinturaProductos} = productos[a];
const {InstalacionProductos} = productos[a];


var suma = 0;

for (let i=0; i<MaterialesProductos.length; i++){
        if (MaterialesProductos[i].Descripcion === materiales[i].Descripcion && materiales[i].PrecioUnitario >= 0 ){
         suma = suma + (MaterialesProductos[i].cantidad *  materiales[i].PrecioUnitario)
        }
}
var Suma2Mano= ((suma * productos[a].ManoObMaterial)/100) + suma;
var Suma3Por= ((Suma2Mano * productos[a].PorcentajeMaterial)/100) +Suma2Mano;

var sumaSolventes = 0;

for (let i=0; i<PinturaProductos.length; i++){
        if (PinturaProductos[i].Descripcion === materiales[i].Descripcion && materiales[i].PrecioUnitario >= 0 ){
            sumaSolventes = sumaSolventes + (PinturaProductos[i].cantidad *  materiales[i].PrecioUnitario)
        }
}
var sumaSolventes2Mano= ((sumaSolventes * productos[a].ManoObPintura)/100) + sumaSolventes;
var sumaSolventes3Por=((sumaSolventes2Mano * productos[a].PorcentajePintura)/100) +sumaSolventes2Mano;

var sumaInsumos = 0;

for (let i=0; i<InstalacionProductos.length; i++){
    if (InstalacionProductos[i].Descripcion === materiales[i].Descripcion && materiales[i].PrecioUnitario >= 0 ){
        sumaInsumos = sumaInsumos + (InstalacionProductos[i].cantidad *  materiales[i].PrecioUnitario)
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





res.redirect('/productos');

}
    


