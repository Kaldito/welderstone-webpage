const Producto = require('../models/Productos.js');
const Cart = require("../models/Cart");

module.exports = async (req, res) => {
    try {
        let role = "viewer";
        let logged = false; 
        let IdUsuario = null;

        if (req.session?.passport?.user) {
            role = req.session.passport.user.role;
            logged = true;
            IdUsuario = req.session.passport.user.id;
        }

        // Obtener parámetros de paginación y filtro
        let page = parseInt(req.query.page) || 1;
        const limit = 18;
        let filtro = req.params.filtro || 'all';
        
        // Construir query de búsqueda
        let query = { Activo: true };
        if (filtro !== 'all') {
            query.familia = filtro;
        }

        // Opciones de paginación
        const options = {
            page,
            limit,
            select: `-MaterialesProductos -PinturaProductos -InstalacionProductos -image2`,
            sort: { createdAt: -1 }
        };

        // Consultar productos y carrito
        const productos = await Producto.paginate(query, options);
        const cart = IdUsuario ? await Cart.find({ UsuarioId: IdUsuario }) : [];

        // Preparar datos para la plantilla
        let templateData = {
            productos: productos.docs,
            roles: role,
            loggedIn: logged,
            cart,
            filtro,
            currentPage: page,
            totalPages: productos.totalPages,
            IdUsuario,
            HayProductoUsuario: cart.length
        };

        res.render('tienda', templateData);
    } catch (error) {
        console.error("Error al cargar la tienda:", error);
        res.status(500).send("Error interno del servidor");
    }
};
