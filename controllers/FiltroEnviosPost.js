const Compra = require("../models/compra")
module.exports = async (req,res)=>{
await Compra.updateOne({Id_transaccion:req.body.Busqueda,$set:{EstatusEnvio:req.body.estatus}})
res.redirect('/envios')
}