
const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

module.exports = async (req,res)=>{
    try {
        const idCustomer  = req.params.id;

        const removedCustomer = await facturapi.customers.del(idCustomer);
        // Envía una respuesta al cliente
        res.send(`<script>alert("Cliente ${removedCustomer.legal_name} eliminado."); window.location.href='/FacturApiClientes';</script>`);


        //console.log(removedCustomer);
    } catch (error) {
        console.error('Error:', error);
        res.send(`<script>alert("Error al eliminar cliente."); window.location.href='/FacturApiClientes';</script>`);

    }
}