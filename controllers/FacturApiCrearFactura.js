
const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
module.exports = async (req,res)=>{
  console.log(req.body)
    try {
        const { idCustomer,
                itemQuantity,
                product_id,
                folio_number,
                series,
                payment_code 
          } = req.body;

          const invoice = await facturapi.invoices.create({
            customer: 
                idCustomer,
            items: [{
              quantity: itemQuantity,
              product: product_id
            }],
            payment_form: payment_code,
            folio_number: folio_number,
            series: series
          });

        console.log(invoice);
        res.send(`<script>alert("Factura creada correctamente"); window.location.href="/FacturApiFactura";</script>`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }
}