const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
module.exports = async (req,res)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    const product_id = req.params.id
    const product = await facturapi.products.retrieve(product_id);
    console.log(product)

    res.render('FacturApiEditarProductos',{roles: role, loggedIn: logged,product_id,product})
}