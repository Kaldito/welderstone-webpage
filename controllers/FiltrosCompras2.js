const Cart = require("../models/Cart");
const Product = require("../models/Productos");
const Compra = require("../models/compra");
const Años = require("../models/Años");

const FiltrosCompras2 = async (req, res) => {
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
    const compra = await Compra.paginate({ProductosComprados:{$elemMatch:{nombre:{$regex:req.body.busqueda}}}},{page:1,limit:30}) 


    var SubTotal =[];
        var Total =0;
        for(b=0; b< compra.docs.length; b++){
        const {ProductosComprados} = compra.docs[b];
        for(a=0; a<ProductosComprados.length; a++){
         suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
         SubTotal.push(suma)
    
        }
    }
    const FiltroPaginado = true;
    const consulta = req.body.busqueda;
    const consulta2 = 123
    res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

    }


    if(Filtro ==="IdTrans"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
        const compra = await Compra.paginate({Id_transaccion:{$regex:req.body.busqueda}},{page:1,limit:30}) 
    var SubTotal =[];
        var Total =0;
        for(b=0; b< compra.docs.length; b++){
        const {ProductosComprados} = compra.docs[b];
        for(a=0; a<ProductosComprados.length; a++){
         suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
         SubTotal.push(suma)
    
        }
    }
    const FiltroPaginado = true;
    const consulta = req.body.busqueda;
    const consulta2 = 123

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

        }
    if(Filtro ==="NombreCliente"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
         const compra = await Compra.paginate({Nombre_comprador:{$regex:req.body.busqueda}},{page:1,limit:30}) 
         var SubTotal =[];
         var Total =0;
         for(b=0; b< compra.docs.length; b++){
         const {ProductosComprados} = compra.docs[b];
         for(a=0; a<ProductosComprados.length; a++){
          suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
          SubTotal.push(suma)
     
         }
     }

     const FiltroPaginado = true;
     const consulta = req.body.busqueda;
     const consulta2 = 123
         res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

         }
    if(Filtro ==="Precio"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];

        //const compra = await Compra.paginate({ProductosComprados:{$elemMatch:{nombre:{$regex:req.body.busqueda}}}},{page:1,limit:30})
        
        const compra = await Compra.paginate({ProductosComprados:{$elemMatch:{precio:{$gt:Number(req.body.BusquedaPrecios), $lt:Number(req.body.BusquedaPrecios2)}}}},{page:1,limit:30}) 
 
        //const compra = await Compra.paginate({ PrecioTotal : { $gt:Number(req.body.BusquedaPrecios), $lt:Number(req.body.BusquedaPrecios2)}},{page:1,limit:30})
            var SubTotal =[];
            var Total =0;
            for(b=0; b< compra.docs.length; b++){
            const {ProductosComprados} = compra.docs[b];
            for(a=0; a<ProductosComprados.length; a++){
             suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
             SubTotal.push(suma)
        
            }
        }
        const FiltroPaginado = true;
        const consulta = req.body.BusquedaPrecios;
        const consulta2 = req.body.BusquedaPrecios2;
            res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

        }
        if(Filtro ==="SubTotal"){
            let role = "viewer";
            var page = req.query.page;
            role = req.session.passport.user.role;
            const IdUsuario = req.session.passport.user.id;    
            const añocreado = await Años.find({});
            const {años} = añocreado[0];
            //const compra = await Compra.paginate({ PrecioTotal : { $gt:req.body.busqueda}},{page:1,limit:30})
            const compra = await Compra.paginate({ PrecioTotal : { $gt:Number(req.body.BusquedaPrecios), $lt:Number(req.body.BusquedaPrecios2)}},{page:1,limit:30})
                var SubTotal =[];
                var Total =0;
                for(b=0; b< compra.docs.length; b++){
                const {ProductosComprados} = compra.docs[b];
                for(a=0; a<ProductosComprados.length; a++){
                 suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
                 SubTotal.push(suma)
            
                }
            }
            const FiltroPaginado = true;
            const consulta = req.body.BusquedaPrecios;
            const consulta2 = req.body.BusquedaPrecios2;
                res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})
    
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
        const compra = await Compra.paginate({ProductosComprados:{$elemMatch:{nombre:{$regex:consulta}}}},{page,limit:30}) 
    
        var SubTotal =[];
            var Total =0;
            for(b=0; b< compra.docs.length; b++){
            const {ProductosComprados} = compra.docs[b];
            for(a=0; a<ProductosComprados.length; a++){
             suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
             SubTotal.push(suma)
        
            }
        }
        const FiltroPaginado = true;
        const consulta2 = 123

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta, consulta2})
    
        }
        
    if(Filtro ==="IdTrans"){

        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
        const compra = await Compra.paginate({Id_transaccion:{$regex:consulta}},{page,limit:30}) 
    var SubTotal =[];
        var Total =0;
        for(b=0; b< compra.docs.length; b++){
        const {ProductosComprados} = compra.docs[b];
        for(a=0; a<ProductosComprados.length; a++){
         suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
         SubTotal.push(suma)
    
        }
    }
    const FiltroPaginado = true;
    const consulta2 = 123

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

        }
    if(Filtro ==="NombreCliente"){
        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
         const compra = await Compra.paginate({Nombre_comprador:{$regex:consulta}},{page,limit:30}) 
         var SubTotal =[];
         var Total =0;
         for(b=0; b< compra.docs.length; b++){
         const {ProductosComprados} = compra.docs[b];
         for(a=0; a<ProductosComprados.length; a++){
          suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
          SubTotal.push(suma)
     
         }
     }
     const consulta2 = 123

     const FiltroPaginado = true;

         res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

         }
    if(Filtro ==="Precio"){
        const consulta2 = req.query.consulta2;

        let role = "viewer";
        var page = req.query.page;
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;    
        const añocreado = await Años.find({});
        const {años} = añocreado[0];

        //const compra = await Compra.paginate({ProductosComprados:{$elemMatch:{nombre:{$regex:req.body.busqueda}}}},{page:1,limit:30})
        const compra = await Compra.paginate({ProductosComprados:{$elemMatch:{precio:{$gt:Number(consulta), $lt:Number(consulta2)}}}},{page,limit:30}) 
 
        //const compra = await Compra.paginate({ PrecioTotal : { $gt:Number(req.body.BusquedaPrecios), $lt:Number(req.body.BusquedaPrecios2)}},{page:1,limit:30})
            var SubTotal =[];
            var Total =0;
            for(b=0; b< compra.docs.length; b++){
            const {ProductosComprados} = compra.docs[b];
            for(a=0; a<ProductosComprados.length; a++){
             suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
             SubTotal.push(suma)
        
            }
        }
        const FiltroPaginado = true;

            res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})

        }
        if(Filtro ==="SubTotal"){
            const consulta2 = req.query.consulta2;

            let role = "viewer";
            var page = req.query.page;
            role = req.session.passport.user.role;
            const IdUsuario = req.session.passport.user.id;    
            const añocreado = await Años.find({});
            const {años} = añocreado[0];
            //const compra = await Compra.paginate({ PrecioTotal : { $gt:req.body.busqueda}},{page:1,limit:30})
            const compra = await Compra.paginate({ PrecioTotal : { $gt:Number(consulta), $lt:Number(consulta2)}},{page,limit:30})
                var SubTotal =[];
                var Total =0;
                for(b=0; b< compra.docs.length; b++){
                const {ProductosComprados} = compra.docs[b];
                for(a=0; a<ProductosComprados.length; a++){
                 suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
                 SubTotal.push(suma)
            
                }
            }
            const FiltroPaginado = true;
    
                res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,consulta,consulta2})
    
            }



 
    }

}else{
        res.redirect('/')
    }
}
module.exports = FiltrosCompras2;
/*

*/