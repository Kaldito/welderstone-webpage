const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");

module.exports = async (req, res) => {
    let role = "viewer";
    let logged = false; 

    if (req.session?.passport?.user) {
        role = req.session.passport.user.role;
        logged = true;
        var IdUsuario = req.session.passport.user.id;
    }

    // Obtener la página actual de la URL (por defecto 1)
    let page = parseInt(req.query.page) || 1;
    const limit = 18;

    // Obtener el filtro de la URL
    let filtro = req.params.filtro || 'all';

    console.log(filtro)

    const options = {
        page: page,
        limit: limit,
        select:`-MaterialesProductos -MaterialesProductos[cantidad] -MaterialesProductos[nombre] -MaterialesProductos[Codigo] -MaterialesProductos[PrecioUnitario] 
        -MaterialesProductos[Familia] -PinturaProductos -InstalacionProductos -image2 `,  // Excluir estos campos
        sort: { createdAt: -1 }
    };

    // Construir el query de búsqueda
    let query = { Activo: true };
    if (filtro !== 'all') {
        query.familia = { $in: [filtro] };
    }

    // Consultar productos con paginación
    let productos = await Producto.paginate(query, options);
    const cart = await Cart.find({});


    let templateData = {
        productos: productos.docs,
        roles: role,
        loggedIn: logged,
        cart,
        filtro: filtro,
        currentPage:page,
        totalPages: productos.totalPages
    };

    if (IdUsuario) {
        templateData.IdUsuario = IdUsuario;
        templateData.HayProductoUsuario = await Cart.find({ UsuarioId: IdUsuario }).count();
    }

    res.render('tienda', 
        templateData
    );
 
};
