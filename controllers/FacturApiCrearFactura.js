
const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

module.exports = async (req,res)=>{
  console.log(req.body)
    try {
        const { idCustomer,
                itemQuantity,
                product_id,
                //folio_number,
                //series,
                payment_code,
                use 
          } = req.body;
//console.log(Number(folio_number))
          const invoice = await facturapi.invoices.create({
            use: use,
            customer: 
                idCustomer,
            items: [{
              quantity: itemQuantity,
              product: product_id
            }],
            payment_form: payment_code,
            //folio_number: Number(folio_number),
            //series: series
          });

        console.log(invoice);
        res.send(`<script>alert("Factura creada correctamente"); window.location.href="/FacturApiFactura";</script>`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }
}