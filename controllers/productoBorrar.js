const path = require('path');
const Producto = require('../models/Productos.js');
const Cart = require('../models/Cart');

module.exports = async (req, res) => {
    console.log(req.params)
    await Producto.deleteOne({ nombre: req.params.id });
    await Cart.deleteMany({ nombre: req.params.id });

    res.redirect('/productos');
};
