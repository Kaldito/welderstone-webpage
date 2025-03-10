const Producto = require('../models/Productos.js');
const Material = require('../models/materiales.js');

module.exports = async (req, res) => {
    let role = 'viewer';

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }
    if (
        role == 'admin' ||
        role == 'Cotizacion' ||
        role == 'Ventas' ||
        role == 'Proyectos'
    ) {
        const page = req.query.page;

        // console.log(page)
        if (page === undefined) {
            const materiales = await Material.find({
                PrecioUnitario: { $gt: 0 },
            });
            if (role == 'admin'){
                var productos = await Producto.find({Activo:true});

            }else if (role == 'Proyectos') {
                var productos = await Producto.find({ $or: [{ Activo: false }, { Activo: { $exists: false } }, { Activo: { $ne: true } }] });
              }

            res.render('productos', {
                productos,
                materiales,
                roles: role,
                loggedIn: true,
            });
        } else {
            const materiales = await Material.find({
                PrecioUnitario: { $gt: 0 },
            });
            const productos = await Producto.find({});

            res.render('productos', {
                productos,
                materiales,
                roles: role,
                loggedIn: true,
            });
        }
    } else {
        res.redirect('/');
    }
};
