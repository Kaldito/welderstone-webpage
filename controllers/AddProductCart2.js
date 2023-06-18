const Cart = require("../models/Cart");
const Product = require("../models/Productos");

const addProductCart2 = async (req, res) => {
    const IdUsuario = req.session.passport.user.id;
    const IdProducto= req.body.id
    const NoAgregar = await Cart.find({nombre:req.body.nombre, UsuarioId:IdUsuario}).count();
    if (NoAgregar === 0){
    await Cart.create({...req.body, amount:req.body.cantidad});
    res.redirect('/productos/'+IdProducto)

    }else if (NoAgregar === 1){
      res.redirect('/tienda')
      console.log("ya Agregado")
    }

};

module.exports = addProductCart2;
