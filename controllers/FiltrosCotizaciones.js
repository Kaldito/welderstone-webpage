const Cart = require("../models/Cart");
const Product = require("../models/Productos");
const Cotizacion = require("../models/cotizaciones.js")
const Años = require("../models/Años");

const FiltrosCotizaciones = async (req, res) => {
    if (req.session?.passport?.user != undefined) {
    var page = req.query.page;
    if (page === undefined  ){

    const Filtro =req.body.FiltroHistorial
    

    let role = "viewer";
    var page = req.query.page;
    role = req.session.passport.user.role;
    const IdUsuario = req.session.passport.user.id;
    var Actual = new Date();
    var Actual2 = new Date();

    const añocreado = await Años.find({});
    const {años} = añocreado[0];
    
        
    if(Filtro ==="1mes"){
        Actual.setDate(Actual.getDate() - 30)
        const cotizaciones =await Cotizacion.paginate({ Fecha_compra: { $gt:(Actual) } },{page:1,limit:30})

    const FiltroPaginado = true;

        res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})
        
    }else if(Filtro ==="2meses"){
        Actual.setDate(Actual.getDate() - 60)
        Actual2.setDate(Actual2.getDate() -30)
        const cotizaciones = await Cotizacion.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page:1,limit:30})
      
    const FiltroPaginado = true;

        res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})

        
    }else if(Filtro ==="3meses"){
        Actual.setDate(Actual.getDate() - 90)
        Actual2.setDate(Actual2.getDate() -60)

        const cotizaciones = await Cotizacion.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page:1,limit:30})
       
    const FiltroPaginado = true;

        res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})


        
    }else {

        const cotizaciones = await Cotizacion.paginate({ "$expr": { "$eq": [{ "$year": "$Fecha_compra" }, Filtro] } },{page:1,limit:30})
     
    const FiltroPaginado = true;

    res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})

}
    


    }else if(page != undefined){

        const Filtro = req.query.Filtro;
        var page = req.query.page;
    let role = "viewer";
    var page = req.query.page;
    role = req.session.passport.user.role;
    const IdUsuario = req.session.passport.user.id;
    var Actual = new Date();
    var Actual2 = new Date();

    const añocreado = await Años.find({});
    const {años} = añocreado[0];
        if(Filtro ==="1mes"){
            Actual.setDate(Actual.getDate() - 30)
            const cotizaciones =await Cotizacion.paginate({ Fecha_compra: { $gt:(Actual) } },{page,limit:30})
  
        const FiltroPaginado = true;
        

            res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})
            
        }else if(Filtro ==="2meses"){
            
            Actual.setDate(Actual.getDate() - 60)
            Actual2.setDate(Actual2.getDate() -30)
            const cotizaciones = await Cotizacion.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page,limit:30})
  
        const FiltroPaginado = true;

            res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})
    
            
        }else if(Filtro ==="3meses"){
            Actual.setDate(Actual.getDate() - 90)
            Actual2.setDate(Actual2.getDate() -60)
    
            const cotizaciones = await Cotizacion.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page,limit:30})
   
        const FiltroPaginado = true;

            res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})
    
    
            
        }else {
    
            const cotizaciones = await Cotizacion.paginate({ "$expr": { "$eq": [{ "$year": "$Fecha_compra" }, Filtro] } },{page,limit:30})

        const FiltroPaginado = true;

        res.render('HistorialCompras',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro})
    
    }


    }



}else{
        res.redirect('/')
    }
};

module.exports = FiltrosCotizaciones;
