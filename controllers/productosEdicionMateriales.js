const Producto = require('../models/Productos.js');
const Material = require('../models/materiales.js');

module.exports = async (req, res) =>{
    console.log(req.params.id)

    let role = "viewer";

    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
    }

    if(role == "admin" || role == "Cotizacion"){
        const ProductoAEditar = await Producto.find({nombre:req.params.id})


        const materiales = await Material.find({});

        const productos = await Producto.find({});
    
        res.render('ProductosMateriales', {productos, materiales, roles: role, loggedIn: true, ProductoAEditar});
      
  
    } else{ 
        res.redirect("/")
    }
}
