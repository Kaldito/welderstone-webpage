const User = require("../models/User.js")

module.exports = async (req, res) => {
    var page = req.query.page;
    var Filtro = req.body.Tipo;
    let role = "viewer";
    let logged = false; 
    var consulta = req.body.busqueda;
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    if (page === undefined  ){

        if(Filtro ==="Nombre"){
            const usuarios = await User.paginate({username:{$regex:req.body.busqueda}},{page:1,limit:50}) 
            const FiltroPaginado = true;
            const consulta = req.body.busqueda;
            res.render('PanelUsuarios',{usuarios,roles: role,loggedIn: true,FiltroPaginado,Filtro,consulta})

        }
        if(Filtro ==="Id"){
            const usuarios = await User.paginate({googleId:{$regex:req.body.busqueda}},{page:1,limit:50}) 
            const FiltroPaginado = true;
            const consulta = req.body.busqueda;
            res.render('PanelUsuarios',{usuarios,roles: role,loggedIn: true,FiltroPaginado,Filtro,consulta})

        }

    }else if (page != undefined){
        var Filtro = req.query.Filtro
        var consulta = req.query.consulta;

        if(Filtro ==="Nombre"){
            const usuarios = await User.paginate({username:{$regex:consulta}},{page,limit:50}) 
            const FiltroPaginado = true;
            res.render('PanelUsuarios',{usuarios,roles: role,loggedIn: true,FiltroPaginado,Filtro,consulta})

        }
        if(Filtro ==="Id"){
            const usuarios = await User.paginate({googleId:{$regex:consulta}},{page,limit:50}) 

            const FiltroPaginado = true;
            res.render('PanelUsuarios',{usuarios,roles: role,loggedIn: true,FiltroPaginado,Filtro,consulta})

        }
    }

}

