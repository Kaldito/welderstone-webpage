// ---------------- PACKAGES ---------------- //
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const cors = require("cors");
const mercadopago = require("mercadopago");
//Whatsapp

const path = require('path');



const fs = require('fs');
const nodemailer = require('nodemailer');

// ---------------- MODELS ---------------- //
const User = require("./models/User.js");
const Cart = require("./models/Cart.js");

// -------------- MIDDLEWARE -------------- //
function nocache(req, res, next) {
    /// function used to remove cache anywhere needed
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
}

// ---------------- APP CONFIG ---------------- //
const app = new express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(cors());
app.set("view engine", "ejs");
//app.use(expressLayouts)

// -------------- SESSION CONFIG -------------- //
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// -------------- PASSPORT CONFIG -------------- //
passport.use(User.createStrategy());
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            role: user.role,
            picture: user.picture,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// - Google OAuth
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/welderstone",
        },
        //http://welderstone.com/auth/google/welderstone
        //http://localhost:3000/auth/google/welderstone
        //https://welderstoneprueba.onrender.com/auth/google/welderstone
        function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate(
                { googleId: profile.id },
                async function (err, user) {
                    if (user?.role == undefined) {
                        await User.updateMany(
                            { googleId: user.googleId },
                            { username: profile.displayName, role: "costumer" }
                        );
                    }

                    return cb(err, user);
                }
            );
        }
    )
);

// - Facebook OAuth
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://welderstone/auth/facebook/welderstone",
        },
        function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate(
                { facebookId: profile.id },
                async function (err, user) {
                    if (user?.role == undefined) {
                        await User.updateMany(
                            { facebookId: profile.id },
                            { username: profile.displayName, role: "costumer" }
                        );
                    }

                    return cb(err, user);
                }
            );
        }
    )
);

// - Microsoft OAuth
passport.use(
    new MicrosoftStrategy(
        {
            // Standard OAuth2 options
            clientID: process.env.MICROSOFT_APP_ID,
            clientSecret: process.env.MICROSOFT_APP_SECRET,
            callbackURL: "ttp://welderstone/auth/microsoft/welderstone",
            scope: ["user.read"],
            // Microsoft specific options

            // [Optional] The tenant for the application. Defaults to 'common'.
            // Used to construct the authorizationURL and tokenURL
            tenant: "common",

            // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
            authorizationURL:
                "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",

            // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
            tokenURL:
                "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOrCreate(
                { microsftId: profile.id },
                async function (err, user) {
                    if (user?.role == undefined) {
                        await User.updateMany(
                            { microsftId: profile.id },
                            { username: profile.displayName, role: "costumer" }
                        );
                    }

                    return done(err, user);
                }
            );
        }
    )
);

// ---------------- DATABASE ---------------- //
mongoose.set("strictQuery", true);
mongoose.connect(
    "mongodb+srv://NoLeDeboANadie:rickygei@noledeboanadie.i6p3wc9.mongodb.net/Woolderstone",
    { useNewUrlParser: true }
);

//mongodb://localhost:27017/Woolderstone
////mongodb+srv://NoLeDeboANadie:rickygei@noledeboanadie.i6p3wc9.mongodb.net/Woolderstone

//mongoose.connect('mongodb://localhost:27017/Woolderstone', {useNewUrlParser: true});
//mongoose.connect("mongodb://0.0.0.0:27017/welderstoneDB");
//mongodb+srv://Aaron:tamales@aaronproyecto.sfdk1.mongodb.net/Woolderstone,

const inicioController = require("./controllers/inicio");
const tiendaController = require("./controllers/tienda");
const loginController = require("./controllers/login");
const logoutController = require("./controllers/logout");
const productosGET = require("./controllers/productosGET");
const materialesGET = require("./controllers/materialesGET");
const materialesEdicionPOST = require("./controllers/materialesEdicionPOST");
const materialesAgregarPOST = require("./controllers/materialesAgregarPOST");
const materialesBusqueda = require("./controllers/materialesBusqueda");
const productosEdicionPOST = require("./controllers/productosEdicionPOST");
const productosAgregarPOST = require("./controllers/productosAgregarPOST");
const productosEdicionMaterialesPOST = require("./controllers/productosEdicionMateriales");
const materialBorrar = require("./controllers/materialBorrar");
const aboutGET = require("./controllers/about");
const productoGET = require("./controllers/productoGET")
const productoBorrar= require('./controllers/productoBorrar');
const productosEMPOST = require('./controllers/productosEMPost')
const getProducts = require('./controllers/GetProducts')
const getProductsCart = require('./controllers/GetProductsCart')
const addProductCart = require('./controllers/AddProductCart')
const addProductCart2 = require('./controllers/AddProductCart2')
const FiltrosUsuarios = require('./controllers/FiltroUsuarios')
const FiltrosUsuarios2 = require('./controllers/FiltroUsuarios2')
const FamiliaPrecio = require('./controllers/FamiliaPrecio')
const SubFamiliaPrecio = require('./controllers/SubFamiliaPrecio')

const putProduct = require('./controllers/PutProduct')
const cart = require('./controllers/cart')
const url = require('url');
const HistorialCompras = require('./controllers/HistorialCompras');
const factura = require ('./controllers/factura');
const FiltrosCompras = require('./controllers/FiltrosCompras');
const pdfDescargar = require('./controllers/descargar');
const pdfCotizacion = require('./controllers/descargarCotizacion');
const pdfDescargarMultiple = require('./controllers/descargarMultiple');
const DesplieguePdf = require('./controllers/pdfPost')
const dataFormGET = require("./controllers/data_formGet");
const dataFormPOST = require("./controllers/data_formPost");
const productoEditarGet = require("./controllers/productoEditarGET");
const FiltrosCompras2 = require("./controllers/FiltrosCompras2");
const PanelUsuarios = require("./controllers/PanelUsuarios");
const Roles = require("./controllers/Roles");
const facturaProductos = require('./controllers/facturaProductos');
const cotizacionProductos = require('./controllers/cotizacionProductos');
const envios = require("./controllers/Envios.js");
const infoEnvios = require("./controllers/infoEnvios");
const FiltroEnviosPost = require("./controllers/FiltroEnviosPost")
const FiltroEnvios = require("./controllers/FiltroEnvios")
const cotizacion = require("./controllers/cotizacion")
const CotizacionesHistorial = require("./controllers/CotizacionesHistorial")
const FiltrosCotizaciones = require("./controllers/FiltrosCotizaciones.js")
const FiltrosCotizaciones2 = require("./controllers/FiltrosCotizaciones2.js")

const infoCotizaciones = require ("./controllers/infoCotizaciones")
const AuthArticulos = require('./controllers/AuthArticulos')
const AuthArticulosPost = require('./controllers/AuthPost')

// MercadoPago

//global.CantidadCarro = await cart.find({}).count()

mercadopago.configure({


    access_token:
        "APP_USR-3363834709709437-021123-c67d96e1feb214bee0c7a3da3817a59f-1307218136",
});



//TEST-3839284531017998-020712-ac9e468d300f8fc099e58dfb6672b92b-1050032368
app.post("/create_preference", async (req, res) => {
    console.log(req.body);
    var compras = [];
    var suma = 0;
    for (i = 1; i < req.body.precio.length; i++) {
        compras.push({
            tittle: req.body.nombre[i],
            unit_price: Number(req.body.precio[i]),
            quantity: Number(req.body.amount[i]),
        });
        suma = suma + req.body.amount[i] * req.body.precio[i];
    }

    let preference = {
        items: compras,

        back_urls: {
            success: "https://welderstoneprueba.onrender.com/feedback",
            failure: "https://welderstoneprueba.onrender.com/feedback",
            pending: "https://welderstoneprueba.onrender.com/feedback",
        },
        auto_return: "approved",
        //notification_url: "https://welderstoneprueba.onrender.com/feedback", //Por ahora tendrá que ser local, una vez levantado el servidor /feedback al final del URL
        notification_url:"https://welderstoneprueba.onrender.com/feedback"
    };

    mercadopago.preferences
        .create(preference)
        .then(async function (response) {
            const Compra = require("./models/compra");
            const IdUsuario = req.session.passport.user.id;
            var today = new Date();

            var date =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();

            await Compra.create({
                PrecioTotal: suma,
                Id_usuario: IdUsuario,
                Id_transaccion: response.body.id,
                Fecha_compra: date,
            });
            for (a = 1; a < req.body.precio.length; a++) {
                await Compra.updateOne(
                    { Id_usuario: IdUsuario, Id_transaccion: response.body.id },
                    {
                        $push: {
                            ProductosComprados: {
                                nombre: req.body.nombre[a],
                                precio: req.body.precio[a],
                                cantidad: req.body.amount[a],
                                image: req.body.image[a],
                                unidad: req.body.unidad[a],
                                codigo: req.body.codigo[a],
                                iva: req.body.iva[a],
                            },
                        },
                    }
                );
            }
            let role = "viewer";
            let logged = false; 
            if(req.session?.passport?.user != undefined){
                role = req.session.passport.user.role;
                logged = true;
            }
            res.render('mercado', {response,preference,roles: role, IdUsuario, loggedIn: logged});
        })
        .catch(function (error) {
            console.log(error);
        });




});





app.use("/whatsapp", async (req,res)=>{

    console.log(req.query.Numero)
    const accountSid = process.env.accountSid
    const authToken = process.env.authToken
    const client = require('twilio')(accountSid, authToken);
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey
    });
const NombreLlave= req.query.Codigo
    const fileContent = fs.readFileSync('./pdfs/'+`${req.query.IdTrans}`+`${req.query.Codigo}`+'.pdf');  

      const params = {
        Bucket: 'welderstonebucket',
        Key: NombreLlave+'.pdf',
        Body: fileContent
      };
      
      s3.putObject(params, function(err, data) {
        if (err) {
          console.error(err);
        } else {
          const url = s3.getSignedUrl('getObject', { Bucket: 'welderstonebucket', Key: NombreLlave+'.pdf', Expires: 120 });
       
      //console.log(` ${url}`);

      client.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: 'Pdf de la cotización de tu producto solicitado  ' + `${url}`,
        to: 'whatsapp:+521'+`${req.query.Numero}`,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.log(error));

    }

    res.redirect('/cotizacionProductos?codigo='+`${req.query.Codigo}`+'&IdTrans='+`${req.query.IdTrans}`)
});

      

})







app.post("/cotizacion", cotizacion)

app.get('/feedback', async function(request, response) {
    const Compra = require("./models/compra");
    const Cart = require("./models/Cart");
    const IdUsuario = request.session.passport.user.id;

    
    const accountSid = 'AC87cdadcbcb336292d4906e19e42e1391';
    const authToken = '7ae5e6a2688df96fdde5e40025b6f4d1';


    const client = require('twilio')(accountSid, authToken);
    
    await Compra.updateOne(
        { Id_transaccion: request.query.preference_id },
        {
            $set: {
                Id_pago: request.query.payment_id,
                Orden_mercancia: request.query.merchant_order_id,
                Nombre_comprador: request.user.username,
                status: request.query.status,
            },
        }
    );
    await Cart.deleteMany({ UsuarioId: IdUsuario });

      client.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: 
        
        `
        Compra realizada, Id de la transacción: ${request.query.preference_id}
        
        ` ,
        to: 'whatsapp:+5218715634557',
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.log(error));





    response.redirect("/");
});

app.use("/notificar", (req, res) => {
    console.log("notificar");
});

global.cantidad = null;
app.use(async (req, res, next) => {
    if (req.session?.passport?.user != undefined) {
        const IdUsuario = req.session.passport.user.id;
        global.cantidad = await Cart.find({ UsuarioId: IdUsuario }).count();
        //console.log(cantidad)
        next();
    } else {
        next();
    }
});
//multiplicar por la cantidad del producto

const tiendaBusqueda = require("./controllers/tiendaBusqueda");
const tiendaFiltros = require("./controllers/tiendaFiltros");

// ---------------- SERVER ---------------- //
// - GET METHOD - //
app.get("/", inicioController);
app.get("/tienda", tiendaController);
app.get("/about", aboutGET);
app.get("/login/:status", loginController);
app.get("/logout", logoutController);
app.get("/productos", nocache, productosGET);
app.get("/productos/:id", productoGET); //error
app.get("/materiales/:status", nocache, materialesGET);
app.get("/tienda/busqueda/:filtro", tiendaFiltros);
app.get("/productos/editar/:Id", nocache, productoEditarGet);
app.get("/data-form", dataFormGET);

// - Google Auth
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);
app.get(
    "/auth/google/welderstone",
    passport.authenticate("google", { failureRedirect: "/login/false" }),
    function (req, res) {
        res.redirect("/");
    }
);

// - Facebook Auth
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
    "/auth/facebook/welderstone",
    passport.authenticate("facebook", { failureRedirect: "/login/false" }),
    function (req, res) {
        res.redirect("/");
    }
);

// - Microsoft Auth
app.get(
    "/auth/microsoft",
    passport.authenticate("microsoft", {
        prompt: "select_account",
    })
);
app.get(
    "/auth/microsoft/welderstone",
    passport.authenticate("microsoft", { failureRedirect: "/login/false" }),
    function (req, res) {
        res.redirect("/");
    }
);







app.use("/Email", async (req,res)=>{
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Configurar el transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mraaronrodriguez373@gmail.com',
        pass: 'nggokwzynambmfji'
    }
});
const pdf = fs.readFileSync('pdfs/1307218136-2ea5ca3e-db15-4315-a560-8b8779b4eefc.pdf');

// Configurar las opciones del correo electrónico
const mailOptions = {
    from: 'mraaronrodriguez373@gmail.com',
    to: 'juanitperez8c@gmail.com',
    subject: 'Asunto del correo electrónico',
    text: 'Contenido del correo electrónico',
    attachments: [{
        filename: 'archivo.pdf',
        content: pdf
      }]
};

// Enviar el correo electrónico
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Correo electrónico enviado: ' + info.response);
    }
});
})



//PDF
app.use("/pdfDescargar", pdfDescargar);
app.use("/pdfCotizacion", pdfCotizacion);

app.use("/DescargarMultiple",pdfDescargarMultiple)

// - POST METHOD - //
app.post("/data-form", dataFormPOST);

// - Materiales
app.post("/materiales/edicion", materialesEdicionPOST);
app.post("/materiales/agregar", materialesAgregarPOST);
app.post("/materiales/busqueda", materialesBusqueda);
app.use('/material/borrar/:id', materialBorrar);
app.use('/FamiliaPrecio', FamiliaPrecio)
app.use('/SubFamiliaPrecio', SubFamiliaPrecio)



// - Productos
app.post("/productos/edicion", productosEdicionPOST);
app.post("/productos/agregar", productosAgregarPOST);
app.post("/productos/EditarMateriales", productosEMPOST);
app.get("/productos/MaterialesEdicion/:id", productosEdicionMaterialesPOST);
app.use("/productos/borrar/:id", productoBorrar);
app.get('/AuthArticulos',AuthArticulos)
app.post('/AuthArticulosPost',AuthArticulosPost)
app.use('/DesplieguePdf',DesplieguePdf)

// - Tienda
app.post("/tienda/busqueda", tiendaBusqueda);

//carrito
app.get("/products", getProducts);
app.get("/cart", cart);
app.get("/products-cart", getProductsCart);
app.post("/products-cart", addProductCart);
app.use("/products-cart/:productId", putProduct);

app.post("/products-cart2", addProductCart2);

//compras
app.get("/HistorialCompras", HistorialCompras);
app.get("/factura", factura);
app.use("/FiltrosCompras", FiltrosCompras);
app.use("/FiltrosCompras2", FiltrosCompras2);
app.get('/facturaProductos', facturaProductos)

//cotizaciones
app.get("/cotizacionProductos",cotizacionProductos)
app.get("/CotizacionesHistorial", CotizacionesHistorial);
app.use("/FiltrosCotizaciones", FiltrosCotizaciones);
app.use("/FiltrosCotizaciones2", FiltrosCotizaciones2);

//usuarios
app.get("/PanelUsuarios", PanelUsuarios);
app.use("/Roles", Roles);

//panelusuarios
app.use("/FiltrosUsuarios", FiltrosUsuarios);
app.use("/FiltrosUsuarios2", FiltrosUsuarios2);
//envios
app.get("/envios",envios)
app.use("/FiltroEnvios",FiltroEnvios)
app.post("/infoEnvios",infoEnvios)
app.post("/infoCotizaciones", infoCotizaciones)

app.post("/FiltroEnviosPost",FiltroEnviosPost)




app.get('/popup/:id',async (req, res) => {
const compra = require('./models/compra')
let role = "viewer";
let logged = false; 
if(req.session?.passport?.user != undefined){
    role = req.session.passport.user.role;
    logged = true;
}
    const id = req.params.id;
    const Compra= await compra.find({Id_transaccion:id})
    const EstadoFijar= Compra[0].Estado
    const title = `${id}`;
    const content = `This is popup ${id}`;
    res.render('popup', { title, content,EstadoFijar,Compra,roles: role, loggedIn: logged });



  });

  app.get('/popup3/:id',async (req, res) => {
    const User = require("./models/User.js")
const Cotizacion = require("./models/cotizaciones.js")
const id = req.params.id;
const title = `${id}`;
    const cotizaciones = await Cotizacion.find({Id_transaccion:id})
    let role = "viewer";
    let logged = false; 
    if(req.session?.passport?.user != undefined){
        role = req.session.passport.user.role;
        logged = true;
    }

        const content = `This is popup ${id}`;
        res.render('popup3', { title, content,roles: role, loggedIn: logged,cotizaciones });
    
    
    
      });


app.use((req, res) => res.render("notfound"));



app.listen(3000, () => {
    console.log("App listening on port 3000");
});


