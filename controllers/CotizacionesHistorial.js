const User = require("../models/User.js")
const Cotizacion = require("../models/cotizaciones.js")
const Años = require("../models/Años");

module.exports = async (req, res) => {
    var page = req.query.page;

    let role = "viewer";
    let logged = false; 

    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
        const IdUsuario = req.session.passport.user.id;
        if (page === undefined  ){

            const cotizaciones = await Cotizacion.paginate({},{page:1,limit:30})
            console.log(cotizaciones)
            const añocreado = await Años.find({});
            var AñoNuevo = new Date();
            const {años} = añocreado[0];
            AñoNuevo = AñoNuevo.getFullYear();
            for(i=0; i < años.length; i++){
            if (AñoNuevo !== años[i].año){
            await Años.updateOne({valor:"unico"},{$push:{años:{año:AñoNuevo}}})
            }}
        const FiltroPaginado = false;
        const Filtro = "ninguno"
        var EstadoFijar="ninguno";
        res.render('CotizacionesHistorial',{roles: role, IdUsuario, loggedIn: logged,años,FiltroPaginado,Filtro,EstadoFijar,cotizaciones})

       }else if(page != undefined){

        const cotizaciones = await Cotizacion.paginate({},{page,limit:30})
        const añocreado = await Años.find({});
        const {años} = añocreado[0];
        var AñoNuevo = new Date();
        AñoNuevo = AñoNuevo.getFullYear();
        for(i=0; i < años.length; i++){
        if (AñoNuevo !== años[i].año){
        await Años.updateOne({valor:"unico"},{$push:{años:{año:AñoNuevo}}})
        }}
        const FiltroPaginado = false;
        const Filtro = "ninguno"
        var EstadoFijar="ninguno";
        res.render('CotizacionesHistorial',{roles: role, IdUsuario, loggedIn: logged,años,FiltroPaginado,Filtro,EstadoFijar,cotizaciones})
       }

}
}

