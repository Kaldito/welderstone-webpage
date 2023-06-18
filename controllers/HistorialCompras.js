const Compra = require("../models/compra");
const Producto = require('../models/Productos.js');
const Años = require("../models/Años");

module.exports = async (req, res) =>{

    let role = "viewer";
    var page = req.query.page;

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
       const IdUsuario = req.session.passport.user.id;
       if (page === undefined  ){

        //solo renderizar las aprobadas y eliminar las no aprobadas
       const compra = await Compra.paginate({status:"approved"},{page:1,limit:30})
       const añocreado = await Años.find({});
       const {años} = añocreado[0];
       var AñoNuevo = new Date();
       AñoNuevo = AñoNuevo.getFullYear();
       for(i=0; i < años.length; i++){
       if (AñoNuevo !== años[i].año){
       await Años.updateOne({valor:"unico"},{$push:{años:{año:AñoNuevo}}})
       }}

       var SubTotal =[];
       var Total =0;
       for(b=0; b<compra.docs.length; b++){
       const {ProductosComprados} = compra.docs[b];
       for(a=0; a<ProductosComprados.length; a++){
        suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
        SubTotal.push(suma)

       }
  
    }
const FiltroPaginado= false;
const Filtro = "ninguno"
var EstadoFijar="ninguno";
    res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,EstadoFijar})
       }else if(page != undefined){
        const compra = await Compra.paginate({status:"approved"},{page,limit:30})

        //solo renderizar las aprobadas y eliminar las no aprobadas

        const añocreado = await Años.find({});
        const {años} = añocreado[0];
    
        var AñoNuevo = new Date();
        AñoNuevo = AñoNuevo.getFullYear();
        for(i=0; i < años.length; i++){
        if (AñoNuevo !== años[i].año){
        await Años.updateOne({valor:"unico"},{$push:{años:{año:AñoNuevo}}})
        }}
        var SubTotal =[];
        var Total =0;
        for(b=0; b<compra.docs.length; b++){
            const {ProductosComprados} = compra.docs[b];
        for(a=0; a<ProductosComprados.length; a++){

            suma= ProductosComprados[a].precio * ProductosComprados[a].cantidad;
            SubTotal.push(suma)       

        }
   
    }
    const FiltroPaginado = false;
    const Filtro = "ninguno"
    var EstadoFijar="ninguno";

        res.render('HistorialCompras',{IdUsuario, compra, roles: role,loggedIn: true,años,SubTotal,FiltroPaginado,Filtro,EstadoFijar})

       }
}
}

//       await Años.updateOne({valor:"unico"},{$push:{años:{año:2023}}},{upsert:true})
