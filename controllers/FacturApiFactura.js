
const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

module.exports = async (req,res)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    try {

        // Todas las facturas de la organización
        const invoiceSearch = await facturapi.invoices.list();
        const clientes = await facturapi.customers.list({
            q: '',

            limit: 100,
            //page: pageCliente
          });
          const productos = await facturapi.products.list({
            q: ' ',
            limit: 100
          });

//console.log(invoiceSearch.data[0].customer)
                res.render('FacturApiFactura',{roles: role, loggedIn: logged,invoiceSearch,clientes,productos})
         
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Error interno del servidor');
            }
}