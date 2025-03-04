const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');

const CartSchema = new Schema({
    _id:{type:String, required: true},
    nombre: { type: String },
    image: { type: String },
    amount: { type: Number },
    precio: { type: Number },
    UsuarioId: { type: String },
    inCart: { type: Boolean, default: true },
    idProducto: { type: String, default: true },

});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
