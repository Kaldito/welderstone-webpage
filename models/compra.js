const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bodyParser = require('body-parser')
const mongoosePaginate= require('mongoose-paginate-v2')

const CompraSchema = new Schema({

    ProductosComprados:[{nombre:{type:String},precio:{type:Number},cantidad:{type:Number},image:{type:String},unidad:{type:String},codigo:{type:String},iva:{type:Number}}], //Ok
    PrecioTotal:{type:Number}, //Ok
    DireccionEnvio:{type:String}, 
    Nombre_comprador:{type:String}, //Ok
    Id_usuario:{type:String}, //Ok
    Correo_comprador:{type:String},    
    //MercadoPAgo
    Id_transaccion:{type:String},  //Ok
    Fecha_compra:{type:Date}, //Ok
    Id_pago:{type:String}, //Ok
    Orden_mercancia:{type:String},
    status:{type:String}, //Ok
    Pais:{type:String, default:"Mexico"},
    Estado:{type:String},
    Telefono:{type:String},
    NombreYApellidos:{type:String},
    Direccion:{type:String},
    Departamento:{type:String},
    Ciudad:{type:String},
    CodigoPostal:{type:Number},
    Extra:{type:String},
    EstatusEnvio:{type:String,default:"Pendiente"},




    
});

CompraSchema.plugin(mongoosePaginate);
const Compra = mongoose.model('Compra',CompraSchema);
module.exports = Compra;

//  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//       await compra.updateOne({nombre:req.body.nombre}, { $push: {años: { año:[a]}}});      


//Fecha_compra:{type:String}, //Ok    Fecha_compra:{type:Date,default:new Date()}     años:[{año:{type:Number}}]
 //Ok





