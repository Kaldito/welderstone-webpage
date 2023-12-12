
const Facturapi = require('facturapi');

module.exports = async(req,res)=>{
    console.log(req.body)

    // Procesar el formulario
        try {
            const { legal_name, email, tax_id,tax_system,addresszip,quantity, description,use,payment_form,productkey,precio,rate,iva } = req.body;
    
            // Crea una instancia del cliente Facturapi con tu clave secreta 
            //const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
            const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

            // Crea una factura usando los datos del formulario
            const invoice = await facturapi.invoices.create({
                customer: {
                    legal_name: legal_name,
                    email: email,
                    tax_id: tax_id,
                    tax_system: tax_system, // Ajusta el sistema de impuestos según tus necesidades
                    // Agrega otros campos de dirección si es necesario
                    address:{zip:addresszip}
                },
                items: [{
                    quantity: quantity,
                    product: {
                        description: description,
                        // Asegúrate de configurar correctamente el product_key
                        product_key:productkey,
                        price: precio,
                        taxes:[{type:iva,rate:rate}]
                    }
                }],
                use: use,
                payment_form: payment_form // Tarjeta de crédito
            });
    
            // Envía la factura por correo electrónico
            await facturapi.invoices.sendByEmail(invoice.id);
    
            // Descarga PDF y XML comprimidos en archivo ZIP
            const zipStream = await facturapi.invoices.downloadZip(invoice.id);
    
            // Puedes guardar la descarga en un archivo o enviarla como respuesta al cliente (en ExpressJS)
            // Aquí se muestra cómo guardarla en un archivo:
            const fs = require('fs');
            const file = fs.createWriteStream('./factura.zip');
            zipStream.pipe(file);
            console.log(file)
            // Envía una respuesta al cliente
            res.send('Factura creada y enviada correctamente.');
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error interno del servidor');
        }
    
}





