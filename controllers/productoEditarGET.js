const Producto = require("../models/Productos.js");
const Material = require("../models/materiales.js");

module.exports = async (req, res) => {
    let role = 'viewer';

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }

    if (role == 'admin' || role == "Proyectos" || role == "Ventas") {
        // Obtener el producto y poblar los materiales referenciados
        const producto = await Producto.findById(req.params.Id)
            .populate('MaterialesProductos.material')
            .exec();

        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        // Obtener todos los materiales disponibles para el modal
        const materiales = await Material.find({ PrecioUnitario: { $gt: 0 } });

        res.render("productoEditar", {
            productoEditar: producto,
            materiales,
            roles: role,
            loggedIn: true,
        });
    } else {
        res.redirect("/");
    }
};

/*
const Producto = require("../models/Productos.js");
const Material = require("../models/materiales.js");

module.exports = async (req, res) => {
    let role = 'viewer';

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }

    if (role == 'admin' || role == "Proyectos" || role == "Ventas") {
        const materiales = await Material.find({PrecioUnitario: { $gt: 0 }});

        const materiales1 = await Material.find({PrecioUnitario: { $gt: 0 }});


        const producto = await Producto.find({ _id: req.params.Id });

        for (j = 0; j < materiales.length; j++) {
            for (i = 0; i < producto[0].MaterialesProductos.length; i++) {
                if (
                    producto[0].MaterialesProductos[i].Codigo ===
                    materiales[j].Codigo
                ) {
                    materiales1[j].cantidad =
                        producto[0].MaterialesProductos[i].cantidad;
   
                }
            }
        }
        producto[0].MaterialesProductos = materiales1;


var  productoEditar = producto[0]
        res.render("productoEditar", {
            productoEditar,
            materiales,
            roles: role,
            loggedIn: true,
        });
    } else {
        res.redirect("/");
    }
};


*/