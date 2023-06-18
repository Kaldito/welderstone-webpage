const Producto = require("../models/Productos.js");
const Material = require("../models/materiales.js");

module.exports = async (req, res) => {
    let role = "viewer";

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }
    if (
        role == "admin" ||
        role == "Ventas" ||
        role == "Proyectos"
    ) {
        var page = req.query.page;

        //console.log(page)
        if (page === undefined) {
            const materiales = await Material.find({ PrecioUnitario: { $gt: 0 } });
            const productos = await Producto.paginate(
                {},
                { page: 1, limit: 10 }
            );
            //console.log(productos)
            res.render("AuthArticulos", {
                productos,
                materiales,
                roles: role,
                loggedIn: true,
            });
        } else {
            const materiales = await Material.find({ PrecioUnitario: { $gt: 0 } });
            const productos = await Producto.paginate({}, { page, limit: 10 });
            //console.log(productos)
            res.render("AuthArticulos", {
                productos,
                materiales,
                roles: role,
                loggedIn: true,
            });
        }
    } else {
        res.redirect("/");
    }
};
