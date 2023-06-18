const User = require("../models/User.js")

module.exports = async (req, res) => {
    var page = req.query.page;

    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    if (page === undefined  ){

    const usuarios = await User.paginate({},{page:1,limit:30});
    const FiltroPaginado= false;
    const Filtro = "ninguno"
    res.render('PanelUsuarios',{usuarios,roles: role, loggedIn: logged,FiltroPaginado,Filtro})

    }else if (page != undefined){



        const usuarios = await User.paginate({},{page,limit:30});
        const FiltroPaginado= false;
        const Filtro = "ninguno"
        res.render('PanelUsuarios',{usuarios,roles: role, loggedIn: logged,FiltroPaginado,Filtro})

    }
}

