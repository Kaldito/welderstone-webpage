
const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

module.exports = async (req,res) => {
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    try {
const NombreABuscar = req.body.NombreABuscar
        // Crea un cliente
        const searchResult = await facturapi.customers.list({
            q: NombreABuscar,

            limit: 100,
            //page: pageCliente
          });
        // Envía una respuesta al cliente
        console.log("ejecutate")
        res.render('FacturApiClientes',{roles: role, loggedIn: logged,searchResult})
        //console.log(searchResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    } 

}
