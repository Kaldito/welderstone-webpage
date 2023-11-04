const express = require('express');
const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');

module.exports =async (req,res)=>{
    console.log(req.body)
    try {
        const { nombreCliente, 
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


        // Crea un cliente
        const customer = await facturapi.customers.create({
            legal_name: nombreCliente,
            tax_id: taxIdCliente,
            tax_system: taxSystemCliente,    
            address: {
              zip: zipCliente,
              street: streetCliente,
              exterior: exteriorCliente,
              interior: interiorCliente,
              neighborhood: neighborhoodCliente,
              city: cityCliente,
              municipality: municipalityCliente,
              state: stateCliente,
              country: countryCliente

            },
            email: emailCliente,
            phone: phoneCliente
          });
        // Envía una respuesta al cliente
        //`<script>alert("Se ha registrado al paciente. Número de fólio: ${nuevoId}"); window.location.href="/form";</script>`
        //res.send('Cliente creada y enviada correctamente.');
        res.send(`<script>alert("Cliente creado y enviado correctamente."); window.location.href='/FacturApiClientes';</script>`);

        console.log(customer);
    } catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Error interno del servidor');
        //res.status(500).send('Error interno del servidor');
        res.send(`<script>alert("Error interno del servidor."); window.location.href='/FacturApiClientes';</script>`);

    }
}