const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");

module.exports = async (req, res) => {
    let role = "viewer";
    let logged = false; 
    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
        logged = true;
        var IdUsuario = req.session.passport.user.id;
    }

    let productos = await Producto.find({});

    const texto = req.body.busqueda;
    const filtrado = [];

    if (texto != "") {
        for (let producto of productos) {
            let nombre = producto.nombre.toLowerCase();

            if (nombre.indexOf(texto.toLowerCase()) != -1) {
                filtrado.push(producto);
            }
        }

        productos = filtrado;
    }

    const cart = await Cart.find({});

    if(IdUsuario != undefined){
        res.render('tienda',{productos, roles: role, IdUsuario, loggedIn: logged, cart, filtro: "all"});
    } else {
        res.render('tienda',{productos, roles: role, loggedIn: logged, cart, filtro: "all"});
    }
};
