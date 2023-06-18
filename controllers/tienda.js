const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");
const User = require("../models/User")

module.exports = async (req, res) =>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
        var IdUsuario = req.session.passport.user.id;
    }

    const productos = await Producto.find({});
    const cart = await Cart.find({});
    const HayProductoUsuario = await Cart.find({ UsuarioId: IdUsuario }).count();

    if(IdUsuario != undefined){
        res.render('tienda',{productos, roles: role, IdUsuario, loggedIn: logged, cart, HayProductoUsuario, filtro: "all"});
    } else {
        res.render('tienda',{productos, roles: role, loggedIn: logged, cart, filtro: "all"});
    }
}
    