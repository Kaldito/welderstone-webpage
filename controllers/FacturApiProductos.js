const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
module.exports = async (req,res)=>{
        
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    try {
 

                const searchResult = await facturapi.products.list({
                  q: ' ',
                  limit: 100
                });
        // Envía una respuesta al cliente
        res.render('FacturApiProductos',{roles: role, loggedIn: logged,searchResult})

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    } 
}
