const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
module.exports = async (req,res)=>{
    
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }

    try {
        const q = req.body.NombreABuscar;

                const searchResult = await facturapi.products.list({
                  q: q,
                  limit: 100
                });
        res.render('FacturApiProductos', { searchResult,roles: role, loggedIn: logged, });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    } 
}