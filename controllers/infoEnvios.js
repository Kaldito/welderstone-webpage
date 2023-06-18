const compra = require('../models/compra');
const path = require('path');

module.exports = async(req,res )=>{
    await compra.updateOne({Id_transaccion:req.body.Busqueda},{ $set: req.body})
    res.redirect('/HistorialCompras')
}