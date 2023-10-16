const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
module.exports = async (req,res)=>{
    try {
        const { 
           facturaID,
           email
         } = req.body; 
console.log(facturaID,email)
// Enviar a otro correo
await facturapi.invoices.sendByEmail(
   facturaID,
   { email: email }
 );

       res.send(`<script>alert("¡Factura enviada al correo!"); window.location.href="/FacturApiFactura";</script>`);
   } catch (error) {
       console.error('Error:', error);
       res.status(500).send('Error interno del servidor');
   }
}