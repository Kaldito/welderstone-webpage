const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

module.exports = async (req,res)=>{
    try {
        const { idCustomer,
          nombreCliente, 
          emailCliente, 
          taxIdCliente, 
          taxSystemCliente, 
          zipCliente, 
          streetCliente, 
          exteriorCliente, 
          interiorCliente, 
          neighborhoodCliente, 
          cityCliente, 
          municipalityCliente, 
          stateCliente, 
          countryCliente, 
          phoneCliente } = req.body;
    
        // Objeto para almacenar los campos que se actualizarán
        const updatedFields = {};
    
        if (nombreCliente) updatedFields.legal_name = nombreCliente;
        if (taxIdCliente) updatedFields.tax_id = taxIdCliente;
        if (taxSystemCliente) updatedFields.tax_system = taxSystemCliente;
    
        // ... otros campos ... 
    
        if (emailCliente) updatedFields.email = emailCliente;
        if (phoneCliente) updatedFields.phone = phoneCliente;
    
        if (zipCliente || streetCliente || exteriorCliente || interiorCliente || neighborhoodCliente || cityCliente || municipalityCliente || stateCliente || countryCliente) {
            updatedFields.address = {};
    
            if (zipCliente) updatedFields.address.zip = zipCliente;
            if (streetCliente) updatedFields.address.street = streetCliente;
            if (exteriorCliente) updatedFields.address.exterior = exteriorCliente;
            if (interiorCliente) updatedFields.address.interior = interiorCliente;
            if (neighborhoodCliente) updatedFields.address.neighborhood = neighborhoodCliente;
            if (cityCliente) updatedFields.address.city = cityCliente;
            if (municipalityCliente) updatedFields.address.municipality = municipalityCliente;
            if (stateCliente) updatedFields.address.state = stateCliente;
            if (countryCliente) updatedFields.address.country = countryCliente;
        }
    
        // Crea un cliente
        const customer = await facturapi.customers.update(idCustomer, updatedFields);
    
        // Envía una respuesta al cliente
        console.log(customer);
        res.send(`<script>alert("¡Cambios guardados con éxito!"); window.location.href="/FacturApiClientes";</script>`);
        } catch (error) {
            console.error('Error:', error);
            res.send('Error interno del servidor');
        }
}