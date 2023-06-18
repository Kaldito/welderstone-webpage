const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");
const User = require("../models/User.js")

module.exports = async (req, res) =>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    
    const IdUsuario = req.session.passport.user.id;
    const productos = await Producto.find({});
    const cart = await Cart.find({});
    const HayProductoUsuario = await Cart.find({ UsuarioId: IdUsuario }).count();
    const Sumas = await Cart.find({UsuarioId: IdUsuario});
    var SubTotal =[];
    var Total =0;
     for(i=0; i<Sumas.length; i++){
      SubTotal[i]= Sumas[i].precio * Sumas[i].amount;
      Total = Total + (Sumas[i].precio * Sumas[i].amount);
     }

     const usuarios= await User.find({_id:req.session.passport.user.id})

    res.render('cart',{productos,cart,roles: role, loggedIn: logged,IdUsuario,HayProductoUsuario,SubTotal, Total,Sumas,usuarios});


}
    else {
        res.redirect('/login/welderstone')
    }
    
    } 