const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
module.exports = async (req,res)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    const product_id  = req.params.id;

    const removedProduct = await facturapi.products.del(product_id);
    res.send(`<script>alert("¡Producto borrado con éxito!"); window.location.href="/FacturApiProductos";</script>`);

}