const Cart = require("../models/Cart");
const Product = require("../models/Productos");

const putProduct = async (req, res) => {
  const { productId } = req.params;
  const { query } = req.query;
  const body = req.body;
  var prueba = Number(body.amount);
  var IdUsuario = req.session.passport.user.id;


  const productBuscado = await Cart.find({nombre:productId,UsuarioId:IdUsuario});


if(query=== "del" && prueba === 1){

  const { productId } = req.params;

  var productInCart = await Cart.find({nombre:productId,UsuarioId:IdUsuario});

  await Cart.deleteOne({nombre:productId,UsuarioId:IdUsuario})

    res.redirect('/cart')

}


if(productBuscado && query=== "delete"){

  const { productId } = req.params;

  var productInCart = await Cart.find({nombre:productId,UsuarioId:IdUsuario});

  await Cart.deleteOne({nombre:productId,UsuarioId:IdUsuario})

    res.redirect('/cart')

}



  if (!query) {
    res.status(404).json({ mensaje: "Debes enviar una query" });

  } else if (productBuscado && query === "add") {
     prueba  = prueba + 1;
     var productInCart = await Cart.find({nombre:productId,UsuarioId:IdUsuario});

     await Cart.updateOne({nombre:productId,UsuarioId:IdUsuario} ,{$set:{amount:prueba}})

      res.redirect('/cart')

  }

   else if (productBuscado && query === "del" && prueba > 1) {
    prueba  = prueba - 1;
    var productInCart = await Cart.find({nombre:productId,UsuarioId:IdUsuario});
    await Cart.updateOne({nombre:productId,UsuarioId:IdUsuario}, {$set:{amount:prueba}})
    res.redirect('/cart')

    
  }

};

module.exports = putProduct;
