const Cotizacion = require('../models/cotizaciones');
const path = require('path');

module.exports = async(req,res )=>{
    await Cotizacion.updateOne({Id_transaccion:req.body.Busqueda},{ $set: req.body})
    res.redirect('/CotizacionesHistorial')
}