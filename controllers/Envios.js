const Compra = require('../models/compra');
module.exports = async (req,res)=>{
    var page = req.query.page;

    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    if (page === undefined  ){
        const compra = await Compra.paginate({},{page:1,limit:30})
        const FiltroPaginado= false;
        const Filtro = "ninguno"
    res.render('envios',{roles: role, loggedIn: logged,compra,FiltroPaginado,Filtro})
    }else if (page != undefined){
        const compra = await Compra.paginate({},{page,limit:30})
        const FiltroPaginado= false;
        const Filtro = "ninguno"
        res.render('envios',{roles: role, loggedIn: logged,compra,FiltroPaginado,Filtro})

    }
}