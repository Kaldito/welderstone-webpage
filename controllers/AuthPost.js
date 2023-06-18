const Producto = require('../models/Productos.js');
const path = require('path');

module.exports = async (req,res)=>{
    console.log(req.body)
    let role = "viewer";

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }
    if (role === "admin") {

    if(req.body.Activo === "true" ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Activo:true}});
        res.redirect('/AuthArticulos')

    }else if(req.body.Activo !== "true"){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Activo:false}});

        res.redirect('/AuthArticulos')

    }
}else{
    res.redirect('/AuthArticulos')

}
}