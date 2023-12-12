var express = require ('express');
var router =express.Router();

const Facturapi = require('facturapi');
//const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');
const facturapi = new Facturapi('sk_live_6DmBl09j7dMbkxayWDbBla8lDDnoRrOL2qw5X4epKZ');

router.get('/Retenciones',async (req,res,next)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }

try {

    const clientes = await facturapi.customers.list({
        q: '',

        limit: 100,
        //page: pageCliente
      });
      //legal_name,email
      const retentionSearch = await facturapi.retentions.list({
        limit: 100});
      console.log(retentionSearch)

      for (j=0; j<clientes.data.length; j++){
      for (i=0; i<retentionSearch.data.length; i++){

        if(retentionSearch.data[i].customer===clientes.data[j].id){
          retentionSearch.data[i].legal_name = clientes.data[j].legal_name
          retentionSearch.data[i].email = clientes.data[j].email


        }
      }
    }

      //console.log(clientes)
    res.render('Retenciones',{roles: role, loggedIn: logged,clientes,retentionSearch})

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error interno del servidor');
        }
});

router.post('/CrearRetencion',async(req,res, next)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }
    const {
        
            idCustomer,
            cve_retenc,
            mes_ini,
            mes_fin,
            ejerc,
            monto_tot_operacion,
            monto_tot_exent,
            monto_ret,
            tipo_pago_ret,
            base_ret,
            impuesto,
            monto_tot_grav,
            monto_tot_ret,
            fecha_exp,
            desc_retenc,
            folio_int,
            external_id,
            idempotency_key
  } = req.body;
const customer = await facturapi.customers.retrieve(idCustomer);
//console.log(req.body)
//console.log(customer)
    try {

        const retention = await facturapi.retentions.create({
            customer:{
               //id:idCustomer,
               legal_name:customer.legal_name,
               tax_id:customer.tax_id,
               tax_system:customer.tax_system,
               address:customer.address,
               email:customer.email,
               phone:customer.phone
            },
            cve_retenc: cve_retenc,
            periodo: {
              mes_ini: mes_ini,
              mes_fin: mes_fin,
              ejerc: ejerc
            },
            totales: {
              monto_tot_operacion: monto_tot_operacion,
              monto_tot_exent: monto_tot_exent,
              imp_retenidos: [
                {
                  monto_ret:monto_ret,
                  tipo_pago_ret:tipo_pago_ret,
                  base_ret: base_ret,
                  impuesto: impuesto
                },

              ],
              
              //monto_tot_grav: Number(monto_tot_grav),
              //monto_tot_ret:monto_tot_ret
              
            },
            fecha_exp:fecha_exp,
            desc_retenc:desc_retenc,
            folio_int:folio_int,
            external_id:external_id,
            idempotency_key:idempotency_key
          });
       
          res.send(`<script>alert("Retención creada correctamente"); window.location.href="/Retenciones/Retenciones";</script>`);
    
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Error interno del servidor');
            }
})

router.get('/popup9/:id', async (req, res) => {

  const id = req.params.id;
  console.log(id)
  const retentionSearch = await facturapi.retentions.list({
    q: id,

  });
  console.log(retentionSearch)
  let role = 'viewer';
  let logged = false;
  if (req.session?.passport?.user != undefined) {
      role = req.session.passport.user.role;
      logged = true;
  }

  const content = `This is popup ${id}`;
  res.render('popup9', {

      roles: role,
      loggedIn: logged,
      id
      
  });
});
module.exports = router;