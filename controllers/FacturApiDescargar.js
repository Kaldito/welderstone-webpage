/*const Facturapi = require('facturapi');
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
       //res.send(`<script>alert("¡Factura descargada con éxito!"); window.location.href="/FacturApiFactura";</script>`); 
   } catch (error) {
       console.error('Error:', error);
       res.status(500).send('Error interno del servidor');
   }
}
*/
const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
const fs = require('fs');

module.exports = async (req, res) => {
    try {
        const facturaID = req.params.id;
        console.log(facturaID);

        // Download the PDF stream
        const pdfStream = await facturapi.invoices.downloadPdf(facturaID);

        // Set the content type and attachment headers for the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura.pdf`);

        // Pipe the PDF stream to the response
        pdfStream.pipe(res);

        console.log("Factura descargada");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }
};
