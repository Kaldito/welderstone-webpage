const Producto = require("../models/Productos.js");
const Material = require("../models/materiales.js");

module.exports = async (req, res) => {
    let role = "viewer";

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }

    if (role == "admin" || role == "Cotizacion") {
        const materiales = await Material.find({PrecioUnitario: { $gt: 0 }});

        const materiales1 = await Material.find({PrecioUnitario: { $gt: 0 }});
        const materiales2 = await Material.find({PrecioUnitario: { $gt: 0 }});
        const materiales3 = await Material.find({PrecioUnitario: { $gt: 0 }});

        const producto = await Producto.find({ _id: req.params.Id });

        //insertar todos los maetriales menos los que ya tengo.
        for (j = 0; j < materiales.length; j++) {
            for (i = 0; i < producto[0].MaterialesProductos.length; i++) {
                if (
                    producto[0].MaterialesProductos[i].Descripcion ===
                    materiales[j].Descripcion
                ) {
                    materiales1[j].cantidad =
                        producto[0].MaterialesProductos[i].cantidad;
   
                }
            }
        }
        producto[0].MaterialesProductos = materiales1;

        for (i = 0; i < producto[0].PinturaProductos.length; i++) {
            for (j = 0; j < materiales.length; j++) {
                if (
                    producto[0].PinturaProductos[i].Descripcion ===
                    materiales[j].Descripcion
                ) {
                    materiales2[j].cantidad =
                        producto[0].PinturaProductos[i].cantidad;

                }
            }
        }
        producto[0].PinturaProductos = materiales2;

        for (i = 0; i < producto[0].InstalacionProductos.length; i++) {

            for (j = 0; j < materiales.length; j++) {
                if (
                    producto[0].InstalacionProductos[i].Descripcion ===
                    materiales[j].Descripcion
                ) {
                    materiales3[j].cantidad =
                        producto[0].InstalacionProductos[i].cantidad;

                }
            }
        }

        producto[0].InstalacionProductos = materiales3;

//console.log(producto[0].MaterialesProductos)

        res.render("productoEditar", {
            productoEditar: producto[0],
            materiales,
            roles: role,
            loggedIn: true,
        });
    } else {
        res.redirect("/");
    }
};
