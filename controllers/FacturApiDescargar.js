const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
const fs = require('fs');

module.exports = async (req,res)=>{
    try {
        const facturaID = req.params.id; 
        console.log(facturaID)
         const pdfStream = await facturapi.invoices.downloadPdf(facturaID);
         const pdfFile = fs.createWriteStream('./factura.pdf');
         pdfStream.pipe(pdfFile);

       console.log("Factura descargada");
       res.send(`<script>alert("¡Factura descargada con éxito!"); window.location.href="/FacturApiFactura";</script>`); 
   } catch (error) {
       console.error('Error:', error);
       res.status(500).send('Error interno del servidor');
   }
}