const path = require('path');
const Producto = require('../models/Productos.js');
const Cart = require('../models/Cart');

module.exports = async (req, res) => {
    console.log(req.params.id +"producto a borrar")
    await Producto.deleteOne({ _id: req.params.id });
    await Cart.deleteMany({ _id: req.params.id });

    res.redirect('/productos');
};
