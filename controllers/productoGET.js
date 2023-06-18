const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");

module.exports = async (req, res) =>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
        var IdUsuario = req.session.passport.user.id;
    }
    const productoDoc = await Producto.findOne({_id: req.params.id});
    const relacionados = await Producto.find({familia: productoDoc.familia, _id: {$ne: productoDoc._id}}).limit(6);

    const cart = await Cart.find({});

    if(IdUsuario != undefined){
        res.render('producto', {roles: role, loggedIn: logged, productoDoc, relacionados, cart, IdUsuario, filtro: productoDoc.familia});
    } else {
        res.render('producto', {roles: role, loggedIn: logged, productoDoc, relacionados, cart, filtro: productoDoc.familia});
    }
}