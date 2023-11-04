var express = require ('express');
var router =express.Router();

const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_EmR5KOQwAW391DLgBqLg0Rrle6VnG742MzdPlpZvaj');

router.get('/Recibos',async (req,res,next)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }

try {

    const invoiceSearch = await facturapi.receipts.list();
    const clientes = await facturapi.customers.list({
        q: '',

        limit: 100,
        //page: pageCliente
      });
      const productos = await facturapi.products.list({
        q: ' ',
        limit: 100
      });

      console.log(invoiceSearch)
            res.render('Recibos',{roles: role, loggedIn: logged,invoiceSearch,clientes,productos})
     
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error interno del servidor');
        }
});

router.post('/CrearRecibo',async(req,res,next)=>{
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }

    try {


    const {
        quantity,
        product_id,
        folio_number,
        payment_form,
        branch
  } = req.body;

  const product = await facturapi.products.retrieve(product_id);


    const receipt = await facturapi.receipts.create({
        folio_number: folio_number,
        payment_form: payment_form,
        branch:branch,
        items: [{
            quantity: quantity,
                product: {
                  description: product.description,
                  product_key: product.product_key,
                  price: product.price,
                  sku: product.sku,

            }
        }],
      });






      res.send(`<script>alert("Recibo creado correctamente"); window.location.href="/Recibos/Recibos";</script>`);

    }catch(error){
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }



})

router.use('/CancelarRecibo/:id',async(req,res,next)=>{

const id = req.params.id
console.log(id)
    const receipt = await facturapi.receipts.cancel(id);
    
    res.send(`<script>alert("Recibo cancelado"); window.location.href="/Recibos/Recibos";</script>`);


})

router.use('/DescargarRecibo/:id',async(req,res,next)=>{

    const id = req.params.id
    console.log(id)


    const pdfStream = await facturapi.receipts.downloadPdf(id);


res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `attachment; filename=factura.pdf`);

// Pipe the PDF stream to the response
pdfStream.pipe(res);

    
    })

    router.get('/popup7/:id', async (req, res) => {

        const id = req.params.id;
    
        let role = 'viewer';
        let logged = false;
        if (req.session?.passport?.user != undefined) {
            role = req.session.passport.user.role;
            logged = true;
        }
    
        const content = `This is popup ${id}`;
        res.render('popup7', {
      
            roles: role,
            loggedIn: logged,
            id
            
        });
    });
router.post('/CorreoRecibos',async(req,res)=>{
try{

    await facturapi.receipts.sendByEmail(
        req.body.reciboID,
        { email: req.body.email }
      );

      res.send(`<script>alert("Recibo enviado al correo"); window.location.href="/Recibos/Recibos";</script>`);

}catch(error){
    res.send(`<script>alert("Ocurrió un error"); window.location.href="/Recibos/Recibos";</script>`);

}


})



module.exports = router;