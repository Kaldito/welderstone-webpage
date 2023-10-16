
const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_zlaq7E1LdVog4PWbyJ4q3Aer9GNY8xDQ635JGprAw2');
module.exports = async (req,res)=>{
    try {
        const idCustomer  = req.params.id;

        const removedCustomer = await facturapi.customers.del(idCustomer);
        // Envía una respuesta al cliente
        res.send(`<script>alert("Cliente ${removedCustomer.legal_name} eliminado. window.location.href="/FacturApiClientes";</script>`);

        //console.log(removedCustomer);
    } catch (error) {
        console.error('Error:', error);
        res.send(`<script>alert("Error al eliminar cliente. window.location.href="/FacturApiClientes";</script>`);

    }
}