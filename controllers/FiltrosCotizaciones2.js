const Cart = require("../models/Cart");
const Product = require("../models/Productos");
const Cotizacion = require("../models/cotizaciones.js")
const Años = require("../models/Años");

const FiltrosCotizaciones2 = async (req, res) => {
    if (req.session?.passport?.user != undefined) {
    var page = req.query.page;
    console.log(page)
    if (page === undefined  ){
    const Filtro = req.body.Filtro2;
    if(Filtro ==="NombreProducto"){
        let role = "viewer";
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
    const cotizaciones = await Cotizacion.paginate({ProductosComprados:{$elemMatch:{nombre:{$regex:req.body.busqueda}}}},{page:1,limit:30}) 


    const FiltroPaginado = true;
    const consulta = req.body.busqueda;
    const consulta2 = 123
    res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

    }


    if(Filtro ==="IdTrans"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
        const cotizaciones = await Cotizacion.paginate({Id_transaccion:{$regex:req.body.busqueda}},{page:1,limit:30}) 

    const FiltroPaginado = true;
    const consulta = req.body.busqueda;
    const consulta2 = 123

        res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

        }
    if(Filtro ==="NombreCliente"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
         const cotizaciones = await Cotizacion.paginate({NombreYApellidos:{$regex:req.body.busqueda}},{page:1,limit:30}) 


     const FiltroPaginado = true;
     const consulta = req.body.busqueda;
     const consulta2 = 123
         res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

         }
    if(Filtro ==="Precio"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];

        
        const cotizaciones = await Cotizacion.paginate({ProductosComprados:{$elemMatch:{precio:{$gt:Number(req.body.BusquedaPrecios), $lt:Number(req.body.BusquedaPrecios2)}}}},{page:1,limit:30}) 
 

        const FiltroPaginado = true;
        const consulta = req.body.BusquedaPrecios;
        const consulta2 = req.body.BusquedaPrecios2;
            res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

        }
        if(Filtro ==="SubTotal"){
            let role = "viewer";
            var page = req.query.page;
            role = req.session.passport.user.role;
            const IdUsuario = req.session.passport.user.id;    
            const añocreado = await Años.find({});
            const {años} = añocreado[0];
            //const compra = await Compra.paginate({ PrecioTotal : { $gt:req.body.busqueda}},{page:1,limit:30})
            const cotizaciones = await Cotizacion.paginate({ PrecioTotal : { $gt:Number(req.body.BusquedaPrecios), $lt:Number(req.body.BusquedaPrecios2)}},{page:1,limit:30})

            const FiltroPaginado = true;
            const consulta = req.body.BusquedaPrecios;
            const consulta2 = req.body.BusquedaPrecios2;
                res.render('CotizacionesHistorial',{IdUsuario, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})
    
            }
       
    }else if(page != undefined){
        const Filtro = req.query.Filtro;
        const consulta = req.query.consulta;
        if(Filtro ==="NombreProducto"){
            let role = "viewer";
            var page = req.query.page;
            role = req.session.passport.user.role;
            const IdUsuario = req.session.passport.user.id;    
            const añocreado = await Años.find({});
            const {años} = añocreado[0];
        const cotizaciones = await Cotizacion.paginate({ProductosComprados:{$elemMatch:{nombre:{$regex:consulta}}}},{page,limit:30}) 
    

        const FiltroPaginado = true;
        const consulta2 = 123

        res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta, consulta2})
    
        }
        
    if(Filtro ==="IdTrans"){

        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
        const cotizaciones = await Cotizacion.paginate({Id_transaccion:{$regex:consulta}},{page,limit:30}) 

    const FiltroPaginado = true;
    const consulta2 = 123

        res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

        }
    if(Filtro ==="NombreCliente"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
         const cotizaciones = await Cotizacion.paginate({NombreYApellidos:{$regex:consulta}},{page,limit:30}) 

     const consulta2 = 123

     const FiltroPaginado = true;

         res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

         }
    if(Filtro ==="Precio"){
        const consulta2 = req.query.consulta2;

        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];

        const cotizaciones = await Cotizacion.paginate({ProductosComprados:{$elemMatch:{precio:{$gt:Number(consulta), $lt:Number(consulta2)}}}},{page,limit:30}) 
 

        const FiltroPaginado = true;

            res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})

        }
        if(Filtro ==="SubTotal"){
            const consulta2 = req.query.consulta2;

            let role = "viewer";
            var page = req.query.page;
            role = req.session.passport.user.role;
            const IdUsuario = req.session.passport.user.id;    
            const añocreado = await Años.find({});
            const {años} = añocreado[0];
            const cotizaciones = await Cotizacion.paginate({ PrecioTotal : { $gt:Number(consulta), $lt:Number(consulta2)}},{page,limit:30})

            const FiltroPaginado = true;
    
                res.render('CotizacionesHistorial',{IdUsuario, cotizaciones, roles: role,loggedIn: true,años,FiltroPaginado,Filtro,consulta,consulta2})
    
            }



 
    }

}else{
        res.redirect('/')
    }
}
module.exports = FiltrosCotizaciones2;