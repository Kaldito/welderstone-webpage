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
        const {
            product_id,
            description,
            product_key,
            price,
            tax_included,
            taxability,
            tax_rate,
            tax_base,
            tax_type,
            tax_factor,
            tax_withholding,
            local_tax_rate,
            local_tax_type,
            local_tax_base,
            local_tax_withholding,
            unit_key,
            unit_name,
            sku
          } = req.body;
    
          const updatedFields = {};

          if (description) updatedFields.description = description;
          if (product_key) updatedFields.product_key = product_key;
          if (price) updatedFields.price = price;
          if (tax_included) updatedFields.tax_included = tax_included;
          if (taxability) updatedFields.taxability = taxability;
          if (tax_rate) updatedFields.tax_rate = tax_rate;
          if (tax_base) updatedFields.tax_base = tax_base;
          if (tax_type) updatedFields.taxes = [{ type: tax_type, rate: tax_rate, base: tax_base, factor: tax_factor, withholding: tax_withholding }];
          if (local_tax_rate) updatedFields.local_taxes = [{ type: local_tax_type, rate: local_tax_rate, base: local_tax_base, factor: 'Tasa', withholding: local_tax_withholding }];
          if (unit_key) updatedFields.unit_key = unit_key;
          if (unit_name) updatedFields.unit_name = unit_name;
          if (sku) updatedFields.sku = sku;
    console.log(updatedFields)
        const product = await facturapi.products.update(product_id, updatedFields);
    
        // Envía una respuesta al cliente
        //console.log(product);
        res.send(`<script>alert("¡Cambios guardados con éxito!"); window.location.href="/FacturApiProductos";</script>`);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error interno del servidor');
        }
}