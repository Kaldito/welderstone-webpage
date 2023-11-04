const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
module.exports = async (req,res)=>{

try {

// Acuse de factura cancelada pdf
const pdfStream = await facturapi.invoices.downloadCancellationReceiptPdf(req.body.facturaID);


        // Set the content type and attachment headers for the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura.pdf`);

        // Pipe the PDF stream to the response
        pdfStream.pipe(res);

}catch(error){
    console.log(error)
    res.status(500).send('Error interno del servidor');
}

}