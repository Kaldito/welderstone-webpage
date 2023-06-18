const Cart = require("../models/Cart");
const Product = require("../models/Productos");
const Compra = require("../models/compra");
const Años = require("../models/Años");

const FiltrosCompras = async (req, res) => {
    if (req.session?.passport?.user != undefined) {
    var page = req.query.page;
    if (page === undefined  ){

    const Filtro =req.body.FiltroHistorial
    

    //const compra = await Compra.paginate({},{page:1,limit:30})
    let role = "viewer";
    var page = req.query.page;
    role = req.session.passport.user.role;
    const IdUsuario = req.session.passport.user.id;
    var Actual = new Date();
    var Actual2 = new Date();
    //console.log(Actual)

    const añocreado = await Años.find({});
    const {años} = añocreado[0];
    
        
    if(Filtro ==="1mes"){
        Actual.setDate(Actual.getDate() - 30)
        const compra =await Compra.paginate({ Fecha_compra: { $gt:(Actual) } },{page:1,limit:30})
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

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})
        //console.log(compra)
        
    }else if(Filtro ==="2meses"){
        Actual.setDate(Actual.getDate() - 60)
        Actual2.setDate(Actual2.getDate() -30)
        const compra = await Compra.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page:1,limit:30})
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

        //console.log(compra)
        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})

        
    }else if(Filtro ==="3meses"){
        Actual.setDate(Actual.getDate() - 90)
        Actual2.setDate(Actual2.getDate() -60)

        const compra = await Compra.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page:1,limit:30})
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

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})

        //console.log(compra)

        
    }else {

        const compra = await Compra.paginate({ "$expr": { "$eq": [{ "$year": "$Fecha_compra" }, Filtro] } },{page:1,limit:30})
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

    res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})

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
            const compra =await Compra.paginate({ Fecha_compra: { $gt:(Actual) } },{page,limit:30})
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
        

            res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})
            //console.log(compra)
            
        }else if(Filtro ==="2meses"){
            
            Actual.setDate(Actual.getDate() - 60)
            Actual2.setDate(Actual2.getDate() -30)
            const compra = await Compra.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page,limit:30})
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

            //console.log(compra)
            res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})
    
            
        }else if(Filtro ==="3meses"){
            Actual.setDate(Actual.getDate() - 90)
            Actual2.setDate(Actual2.getDate() -60)
    
            const compra = await Compra.paginate({ Fecha_compra : { $gt:(Actual), $lt:(Actual2)}},{page,limit:30})
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

            res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})
    
            //console.log(compra)
    
            
        }else {
    
            const compra = await Compra.paginate({ "$expr": { "$eq": [{ "$year": "$Fecha_compra" }, Filtro] } },{page,limit:30})
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

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro})
    
    }


    }



}else{
        res.redirect('/')
    }
};

module.exports = FiltrosCompras;




//Compra.find({ Fecha_compra : { $gt:(Actual), $lt:Fecha_compra(Actual)}})

//

  //console.log(compra[i].Fecha_compra)
    //console.log(Actual - compra[i].Fecha_compra)