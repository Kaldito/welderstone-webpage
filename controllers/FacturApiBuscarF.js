
const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
module.exports = async (req,res)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    try {
        const Nombre = req.body.Nombre

        const filterCriteria = {

                    q: Nombre,
       
        };
        // Todas las facturas de la organización
        const invoiceSearch1 = await facturapi.invoices.list(filterCriteria);
        const invoicesDetails = [];

        for (let i = 0; i < invoiceSearch1.data.length; i++) {
            const invoiceId = invoiceSearch1.data[i].id;
            const invoice = await facturapi.invoices.retrieve(invoiceId);
            invoicesDetails.push(invoice);
        }

        const invoiceSearch = {
            page: 1, // Set your desired page number here
            total_pages: 1, // You need to determine this based on your data
            total_results: invoicesDetails.length, // Get the total number of results
            data: invoicesDetails.map(invoice => ({
              id: invoice.id,
              created_at: invoice.created_at,
              livemode: invoice.livemode,
              cfdi_version: invoice.cfdi_version,
              organization: invoice.organization,
              date: invoice.date,
              customer: invoice.customer,
              address: invoice.address,
              verification_url: invoice.verification_url,
              status: invoice.status,
              type: invoice.type,
              cancellation_status: invoice.cancellation_status,
              total: invoice.total,
              uuid: invoice.uuid,
              use: invoice.use,
              folio_number: invoice.folio_number,
              series: invoice.series,
              payment_form: invoice.payment_form,
              payment_method: invoice.payment_method,
              currency: invoice.currency,
              exchange: invoice.exchange,
              stamp: invoice.stamp,
              items: invoice.items,
              export: invoice.export
            }))
          };
          
          
          


        const clientes = await facturapi.customers.list({
            q: ' ',

            limit: 100,
            //page: pageCliente
          });
          const productos = await facturapi.products.list({
            q: ' ',
            limit: 100
          });
          console.log(invoiceSearch)

                res.render('FacturApiFactura',{roles: role, loggedIn: logged,invoiceSearch,clientes,productos})
         
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Error interno del servidor');
            }
}