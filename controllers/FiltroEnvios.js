const Compra = require("../models/compra")
module.exports = async (req,res)=>{
    var page = req.query.page;
    var Filtro = req.body.estatus;
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
   
    if (page === undefined  ){

        if(Filtro ==="Pendiente"){

            const compra = await Compra.paginate({EstatusEnvio:"Pendiente"},{page:1,limit:50});
    
            const FiltroPaginado = true;
    
            res.render('envios',{compra, roles: role,loggedIn: true,FiltroPaginado,Filtro})
        }
        
        if(Filtro ==="Enviado"){

            const compra = await Compra.paginate({EstatusEnvio:"Enviado"},{page:1,limit:50});
    
            const FiltroPaginado = true;
    
            res.render('envios',{compra, roles: role,loggedIn: true,FiltroPaginado,Filtro})
        }
        
        if(Filtro ==="Entregado"){

            const compra = await Compra.paginate({EstatusEnvio:"Entregado"},{page:1,limit:50});
    
            const FiltroPaginado = true;
    
            res.render('envios',{compra, roles: role,loggedIn: true,FiltroPaginado,Filtro})
        }


    }else if (page !== undefined){
        var Filtro = req.query.Filtro
        var page = req.query.page;
        if(Filtro ==="Pendiente"){

            const compra = await Compra.paginate({EstatusEnvio:"Pendiente"},{page,limit:50});
    
            const FiltroPaginado = true;
    
            res.render('envios',{compra, roles: role,loggedIn: true,FiltroPaginado,Filtro})
        }
        
        if(Filtro ==="Enviado"){

            const compra = await Compra.paginate({EstatusEnvio:"Enviado"},{page,limit:50});
    
            const FiltroPaginado = true;
    
            res.render('envios',{compra, roles: role,loggedIn: true,FiltroPaginado,Filtro})
        }
        
        if(Filtro ==="Entregado"){

            const compra = await Compra.paginate({EstatusEnvio:"Entregado"},{page,limit:50});
    
            const FiltroPaginado = true;
    
            res.render('envios',{compra, roles: role,loggedIn: true,FiltroPaginado,Filtro})
        }




    }
 
}else{
    res.redirect('/')
}
}