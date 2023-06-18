const material = require("../models/materiales.js");
const Producto = require("../models/Productos.js");

module.exports = async (req, res) => {
    const BusquedaCodigo = await material
        .find({ Codigo: req.body.Codigo })
        .count();
    if (BusquedaCodigo === 0) {
        await material.create(req.body);
        await material.updateOne({Descripcion: req.body.Descripcion}, {Codigo: req.body.Codigo.trim()});
      

        res.redirect("/materiales/true");
    } else if (BusquedaCodigo === 1) {
        //console.log("ya creado");
 
        res.redirect("/materiales/false");
    }
};
