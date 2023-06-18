const User = require("../models/User.js")

module.exports = async (req, res) => {
    var page = req.query.page;
    var Filtro = req.body.role;
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
   
    if (page === undefined  ){

    if(Filtro ==="admin"){

        const usuarios = await User.paginate({role:"admin"},{page:1,limit:50});

        const FiltroPaginado = true;

        res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})
    }

    if(Filtro ==="Ventas"){
        const usuarios = await User.paginate({role:"Ventas"},{page:1,limit:50});
        const FiltroPaginado = true;

        res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

    }
    if(Filtro ==="Proyectos"){
        const usuarios = await User.paginate({role:"Proyectos"},{page:1,limit:50});
        const FiltroPaginado = true;

        res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

    }
    if(Filtro ==="Cotizacion"){
        const usuarios = await User.paginate({role:"Cotizacion"},{page:1,limit:50});
        const FiltroPaginado = true;

        res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

    }
    if(Filtro ==="costumer"){
        const usuarios = await User.paginate({role:"costumer"},{page:1,limit:50});
        const FiltroPaginado = true;

        res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

    }

    }else if (page != undefined){
        var Filtro = req.query.Filtro
        var page = req.query.page;

        if(Filtro ==="admin"){
            const usuarios = await User.paginate({role:"admin"},{page,limit:50});
            const FiltroPaginado = true;

            res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})


        }
    
        if(Filtro ==="Ventas"){
    
            const FiltroPaginado = true;

            const usuarios = await User.paginate({role:"Ventas"},{page,limit:50});
            console.log(usuarios)
            res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

        }
        if(Filtro ==="Proyectos"){
            const usuarios = await User.paginate({role:"Proyectos"},{page,limit:50});
            const FiltroPaginado = true;


            res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

        }
        if(Filtro ==="Cotizacion"){
            const usuarios = await User.paginate({role:"Cotizacion"},{page,limit:50});
            const FiltroPaginado = true;

            res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

        }
        if(Filtro ==="costumer"){
            const usuarios = await User.paginate({role:"costumer"},{page,limit:50});
            const FiltroPaginado = true;

            res.render('PanelUsuarios',{usuarios, roles: role,loggedIn: true,FiltroPaginado,Filtro})

    
        }

    }
}else{
    res.redirect('/')
}

}

//db.test.find().sort({ firstName: 1 }).collation({ locale: "en", caseLevel: true })