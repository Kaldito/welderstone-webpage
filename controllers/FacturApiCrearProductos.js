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
        const { descriptionProducto, 
            keyProducto, 
            priceProducto, 
            taxIncludedProducto, 
            taxabilityProducto, 
            taxesType, 
            taxesRate, 
            taxesBase, 
            taxesFactor, 
            taxesWithholding,
            taxesLocalType, 
            taxesLocalRate, 
            taxesLocalBase,  
            taxesLocalWithholding, 
            unitKey,
            unitName,
            sku
          } = req.body;

          const isChecked = taxIncludedProducto === 'on'; 
          const booleanTax = isChecked ? 'true' : 'false'; 

        // Crea un cliente
        const product = await facturapi.products.create({
     
            description: descriptionProducto,
            product_key: keyProducto,
            price: priceProducto,
            tax_included: booleanTax,
            taxability: taxabilityProducto,
             taxes: [
              {
                type: taxesType,
                rate: taxesRate,
                base: taxesBase,
                factor: taxesFactor,
                withholding: true

              }
            ], 
             local_taxes: [
                {
                  type: taxesLocalType,
                  rate: Number(taxesLocalRate),
                  base: taxesLocalBase,
                    withholding: true
    
                  }
            ], 
            unit_key: unitKey,
            unit_name: unitName,
            sku: sku
          });
        // Envía una respuesta al cliente

        //res.render('FacturApiProductos', { product,roles: role, loggedIn: logged, });
        res.send(`<script>alert("¡Producto creado con éxito!"); window.location.href="/FacturApiProductos";</script>`);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }
}