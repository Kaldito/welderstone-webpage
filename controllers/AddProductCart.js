const Cart = require("../models/Cart");
const Product = require("../models/Productos");

const addProductCart = async (req, res) => {
    const IdUsuario = req.session.passport.user.id;
    const NoAgregar = await Cart.find({nombre:req.body.nombre, UsuarioId:IdUsuario}).count();
    if (NoAgregar === 0){
    await Cart.create({...req.body, amount:1});
    res.redirect('/tienda')

    }else if (NoAgregar === 1){
      res.redirect('/tienda')
      console.log("ya Agregado")
    }

};

module.exports = addProductCart;


/*

const Cart = require("../models/Cart");
const Product = require("../models/Productos");

const addProductCart = async (req, res) => {
  const { nombre, image, precio,_id, UsuarioId } = req.body;

  const estaEnProducts = await Product.findOne({ nombre });

  const noEstaVacio = nombre !== "" && image !== "" && precio !== "" && _id !== "" && UsuarioId !== "";

  const estaEnElCarrito = await Cart.findOne({ nombre });

  if (!estaEnProducts) {
    res.redirect('/tienda')


  } else if (noEstaVacio && !estaEnElCarrito) {
    const newProductInCart = new Cart({ nombre, image, precio, amount: 1 ,_id,UsuarioId});

    await Product.findByIdAndUpdate(
      estaEnProducts?._id,
      { inCart: true, nombre, image, precio, _id, UsuarioId },
      { new: true }
    )
      .then((product) => {
       newProductInCart.save();
        res.redirect('/tienda')

      })
      .catch((error) => console.error(error));

  } else if (estaEnElCarrito) {
    res.redirect('/tienda')

  }
};

module.exports = addProductCart;

*/