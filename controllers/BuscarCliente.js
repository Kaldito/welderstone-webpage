
const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');

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
        res.render('FacturApiClientes',{roles: role, loggedIn: logged,searchResult})
        //console.log(searchResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    } 

}
