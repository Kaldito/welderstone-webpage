const material = require("../models/materiales.js");

module.exports = async (req, res) => {
    let role = "viewer";

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
    }

    if (
        role == "admin" ||
        role == "Cotizacion" ||
        role == "Ventas" ||
        role == "Proyectos"
    ) {
        //console.log(page)
        const materiales = await material.find({}).sort({ Familia: 1 });

        var familias = [];
        for (i = 0; i < materiales.length; i++) {
            familias.push(materiales[i].Familia);
        }
        const unicos = [...new Set(familias)];

        var SubFamilias=[];
        for (j=0; j<materiales.length; j++){
       
                SubFamilias.push(materiales[j].SubFam);


        }
        const unicos2 = [...new Set(SubFamilias)];

        res.render("materiales", {
            unicos,
            unicos2,
            materiales,
            roles: role,
            loggedIn: true,
            status: req.params.status,
        });
    } else {
        res.redirect("/");
    }
};
