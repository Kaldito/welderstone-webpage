const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

module.exports =async (req,res)=>{

    const invoice = await facturapi.invoices.cancel(req.body.facturaID,{ motive:req.body.motivo  });
    res.send(`<script>alert("¡Factura cancelada con éxito!"); window.location.href="/FacturApiFactura";</script>`);
}
