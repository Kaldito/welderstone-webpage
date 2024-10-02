const Producto = require('../models/Productos.js');
const Cart = require('../models/Cart');
const User = require('../models/User');

module.exports = async (req, res) => {
    let role = 'viewer';
    let logged = false;
    let page = parseInt(req.query.page) || 1;  // Página actual, por defecto 1
    const limit = 18;  // Limitar los resultados a 18 por página

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
        logged = true;
        var IdUsuario = req.session.passport.user.id;
    }

    // Usamos paginación
    const options = {
        page: page,
        limit: limit,  // Limitar a 18 productos por página
        select:`-MaterialesProductos -MaterialesProductos[cantidad] -MaterialesProductos[nombre] -MaterialesProductos[Codigo] -MaterialesProductos[PrecioUnitario] 
        -MaterialesProductos[Familia] -PinturaProductos -InstalacionProductos -image2 `,  // Excluir estos campos
        sort: { createdAt: -1 }  // Ordenar por la fecha de creación
    };

    // Paginar los productos
    const productos = await Producto.paginate({Activo:true}, options);
    const cart = await Cart.find({});
    console.log(productos.docs[0])

    if (IdUsuario != undefined) {
        res.render('tienda', {
            productos: productos.docs, // Solo los productos de la página actual
            roles: role,
            IdUsuario,
            loggedIn: logged,
            cart,
            HayProductoUsuario: await Cart.find({ UsuarioId: IdUsuario }).count(),
            filtro: 'all',
            totalPages: productos.totalPages,  // Total de páginas
            currentPage: page,  // Página actual
        });
    } else {

        res.render('tienda', {
            
            productos: productos.docs,  // Solo los productos de la página actual
            roles: role,
            loggedIn: logged,
            cart,
            filtro: 'all',
            totalPages: productos.totalPages,  // Total de páginas
            currentPage: page,  // Página actual
        });
    }
};
