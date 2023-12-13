const pdfDescargar = require('../controllers/descargar')
const PdfPrinter = require("pdfmake")
const fs = require("fs")
const fonts = require("../pdf/fonts")
const styles = require("../pdf/styles")
const Product = require("../models/Productos");
const Material = require('../models/materiales.js');
const AWS = require('aws-sdk');
const axios = require('axios'); // You'll need to install this library (npm install axios)

//const moment = require('moment');


module.exports = async (req, res) =>{

       //console.log( req.query.IdTrans)
       const IdTransaccion = req.query.IdTrans
       const materiales= await Material.find({})
       var ProductosAgregar = [];
       var Almacen;
    Almacen = await Product.find({Codigo:req.query.codigo})

    ProductosAgregar.push(Almacen)



    ProductosAgregar[0][0] === Almacen

var productodatos = Almacen;
//console.log(productodatos[0])
var DescripcionPDf =  productodatos[0].descripcion
const FechaCompra =new Date();

var date =
FechaCompra.getFullYear() +
"-" +
(FechaCompra.getMonth() + 1) +
"-" +
FechaCompra.getDate();

//date = moment(date, 'D-M-YY').format('D/M/YY');

var caduca =
FechaCompra.getFullYear() +
"-" +
(FechaCompra.getMonth() + 2) +
"-" +
FechaCompra.getDate();

//caduca = moment(caduca, 'D-M-YY').format('D/M/YY');

const NomProd= productodatos[0].nombre
const CantidadProd= productodatos[0].cantidad
const precioProd= productodatos[0].precio
const unidadProd = productodatos[0].unidad
const Importe = CantidadProd*precioProd


const codigo = productodatos[0].Codigo

var imagen;

if(productodatos[0].image === "" || productodatos[0].image === undefined){

    imagen = '/images/productos/PorDefecto.jpg'
}else{
    imagen = productodatos[0].image.toString()

}

const productosMaterialesDescripcion =[];
       try{

       for(let i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){

        productosMaterialesDescripcion.push(ProductosAgregar[0][0].MaterialesProductos[i].Descripcion)


       }
    }catch(e){
        console.log(error)
    }
    
 
       const productosMaterialesCodigo =[];
       try{
  
       for(let i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){

        productosMaterialesCodigo.push(ProductosAgregar[0][0].MaterialesProductos[i].Codigo)

       }
    }catch(e){
        console.log(error)
    }
       const productosMaterialesCantidad =[];
       try{

       for(let i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){

        productosMaterialesCantidad.push(ProductosAgregar[0][0].MaterialesProductos[i].cantidad)


       }
    }catch(e){
        console.log(error)
    }
       const ProductosMaterialesPrecio =[]

       try{

       for(j=0; j<materiales.length; j++){

       for(i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){
        if(ProductosAgregar[0][0].MaterialesProductos[i].Codigo === materiales[j].Codigo ){

            ProductosMaterialesPrecio.push(materiales[j].PrecioUnitario)

        }

       }

    }
}catch(e){
    console.log(error)
}

    var PreciosMateriales =[]
       try{

for (b=0; b<ProductosMaterialesPrecio.length; b++){
    if (ProductosMaterialesPrecio[b] !== '\n\n'){
        PreciosMateriales.push(ProductosMaterialesPrecio[b].toFixed(2))

    }

}

}catch(e){
    console.log(error)
}

    const ProductosMaterialesUnidad =[]

    try{

    for(j=0; j<materiales.length; j++){

    for(i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){
     if(ProductosAgregar[0][0].MaterialesProductos[i].Codigo === materiales[j].Codigo ){

        ProductosMaterialesUnidad.push(materiales[j].Unidad)

     }

    }

 }
}catch(e){
    console.log(error)
}


const ImporteMaterial=[]
try{



for(i=0; i<ProductosMaterialesPrecio.length; i++){
if(ProductosMaterialesPrecio[i] >0 && ProductosMaterialesPrecio[i] !== '\n\n' && productosMaterialesCantidad[i]>0 && productosMaterialesCantidad[i] !=='\n\n'){
    ImporteMaterial.push(ProductosMaterialesPrecio[i]*productosMaterialesCantidad[i])
}
}
}catch(e){
    console.log(error)
}

var ImporteMateriales=[]
try{

for (a =0; a<ImporteMaterial.length; a++ ){
ImporteMateriales.push(ImporteMaterial[a].toFixed(2))
}
}catch(e){
    console.log(error)
}
 

var MaterialSuma= 0 ;
try{
for (c=0; c<ImporteMateriales.length; c++){
    MaterialSuma=MaterialSuma+Number(ImporteMateriales[c])
}
}catch(e){

}

var MaterialSumaR = MaterialSuma.toFixed(2)





var Total1 = MaterialSuma

var HerrMenor = (productodatos[0].ManoObGeneral * Total1)/100
Total1 = (productodatos[0].ManoObGeneral * Total1)/100+ Total1  
y = (HerrMenor*  productodatos[0].HerramientaMenor)/100
Total1= Total1+y
var indirectosPrecio= Total1

var indirectosPrecio2 = (indirectosPrecio * productodatos[0].PorcentajeGeneral)/100

Total1 = (productodatos[0].PorcentajeGeneral * Total1)/100 + Total1


const Total1R = Number(Total1).toFixed(2)


//.toFixed(2)

const iva = productodatos[0].iva

var IvaCalculo = (iva * Total1R)/100

const ManoObGeneral = productodatos[0].ManoObGeneral

const HerramientaMenor = productodatos[0].HerramientaMenor

const PorcentajeGeneral = productodatos[0].PorcentajeGeneral


const SubTotal = Total1

const SubTotalR = Number(SubTotal).toFixed(2)

const TotalFinal = Number(SubTotalR) +(Number(SubTotalR)*(Number(iva)/100))

var TotalFinalR = Number(TotalFinal).toFixed(2)
function formatNumber(value) {
    var formatter = new Intl.NumberFormat('en-US');
    return formatter.format(value);
  }
  
// Formatear los arrays de precios e importes
var preciosFormateados = PreciosMateriales.map(formatNumber);
var importesFormateados = ImporteMateriales.map(formatNumber);
// Formatear los arrays de precios e importes


// Función para formatear y redondear números a 2 decimales
function formatNumberWithDecimals(value) {
    var roundedValue = parseFloat(value).toFixed(2);
    return formatNumber(roundedValue);
  }
  
  // Formatear el valor de MaterialSumaR con separación de miles y redondeo a 2 decimales
  var MaterialSumaRFormateado = formatNumberWithDecimals(MaterialSumaR);


var Total1RFormateado = formatNumberWithDecimals(Total1R)

var TotalFinalPdf =  + Number(IvaCalculo) +Number(Total1)

TotalFinalPdf  = formatNumberWithDecimals(TotalFinalPdf)

IvaCalculo = formatNumberWithDecimals(IvaCalculo) 

indirectosPrecio = formatNumberWithDecimals(indirectosPrecio)
indirectosPrecio2 =formatNumberWithDecimals(indirectosPrecio2)
HerrMenor=formatNumberWithDecimals(HerrMenor)
y=formatNumberWithDecimals(y)


var SubTotalRFormateado = formatNumberWithDecimals(SubTotalR)
var TotalFinalRFormateado = formatNumberWithDecimals(TotalFinalR)
var ivaDesgloce = ((iva/100)*Number(SubTotalR))
var ivaDesgloceFormateado = formatNumberWithDecimals(ivaDesgloce)



async function getImageDataUrl(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(response.data, 'binary').toString('base64');
        return `data:image/jpeg;base64,${imageData}`;
    } catch (error) {
        console.error('Error fetching image from S3:', error);
        return null;
    }
}

const imageUrl = imagen;
const imageDataURL = await getImageDataUrl(imageUrl);
       let docDefinition ={

    content :[
      
       
        {columns:[{image:'./public/images/productos/welderstone.png',width: 160, alignment:'left'},{},{image:imageDataURL,width: 80, height:80,alignment:'center',fit: [230,230], absolutePosition: {x: 50, y: 10}},{text: 'Cotización', style: 'header',	alignment: 'right'}]},
        
            {
                style: 'tableExample',
                layout: 'noBorders', // Utilizamos 'noBorders' en lugar de 'auto' para eliminar los bordes de la tabla
                table: {
                  widths: [80, 80, 80],
                  body: [
                    [
                      { text: 'Fecha', style: 'tableHeader', alignment: 'left' },
                      { text: date, alignment: 'left' },
                    ],
                    [
                      { text: 'Codigo', style: 'tableHeader', alignment: 'left' },
                      { text: codigo, alignment: 'left' },
                    ],
                    [
                      { text: 'Valido hasta', style: 'tableHeader', alignment: 'left' },
                      { text: caduca, alignment: 'left' },
                    ],
                  ],
                },
                absolutePosition: { x: 600, y: 80 },
              },
{text: ['Sitio web: www.Welderstone.com\n','Teléfono: 87-12-64-69-82 \n','E-mail: Welderstone@outlook.com'], margin: [0, 20,]},
{
    text: [
      { text: 'Descripción del producto\n', style: 'redText' },
      DescripcionPDf
    ],
    margin: [0, 20]
  }
,  
	{
			alignment: 'center',
			columns: [
				 {  width: 300,
					text: '',
					alignment: 'center',
				}
			]
		},
        { text: '\n' },
        {
            style: 'tableExample',
            alignment: 'center',
            table: {
              headerRows: 1,
              alignment: 'center',
              widths: ['*', 280, '*', '*', '*', '*'],
              body: [
                [
                    { text: 'Codigo', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Material', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Unidad', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Cantidad', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Precio Unitario', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'importe', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' }
                  ],
                ...(productosMaterialesDescripcion.map((desc, i) => [
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosMaterialesCodigo[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: desc, alignment: 'left'},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: ProductosMaterialesUnidad[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosMaterialesCantidad[i]},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+preciosFormateados[i]},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+importesFormateados[i] }
                ])),  
  
                
                [{ fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' '}, 
                { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' '}],
                
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: 'Material' ,  bold:true}, 
                { fillColor: '#F2F2F2', text: ' ', bold:true }, 
                { fillColor: '#F2F2F2', text: 'Suma' ,  bold:true}, { fillColor: '#F2F2F2', text: '$'+MaterialSumaRFormateado , bold:true}],

                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: 'Mano de obra' ,  bold:true}, 
                { fillColor: '#F2F2F2', text: ManoObGeneral + '%', bold:true }, 
                { fillColor: '#F2F2F2', text:  '$'+MaterialSumaRFormateado,  bold:true}, { fillColor: '#F2F2F2', text: '$'+HerrMenor, bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: 'Herramienta menor',  bold:true }, 
                { fillColor: '#F2F2F2', text: HerramientaMenor + '%', bold:true }, 
                { fillColor: '#F2F2F2', text:  '$'+HerrMenor,  bold:true}, { fillColor: '#F2F2F2', text: '$'+y, bold:true}],

                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: 'Indirectos + Honorarios' ,  bold:true}, 
                { fillColor: '#F2F2F2', text: PorcentajeGeneral + '%', bold:true }, 
                { fillColor: '#F2F2F2', text:  '$'+indirectosPrecio,  bold:true}, { fillColor: '#F2F2F2', text: '$'+indirectosPrecio2, bold:true}],

                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', 
                { fillColor: '#FFFFFF', text: 'SubTotal', bold:true }, 
                { fillColor: '#FFFFFF', text: '$'+Total1RFormateado,  bold:true}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', 
                { fillColor: '#FFFFFF', text: 'Iva', bold:true }, 
                { fillColor: '#FFFFFF', text: '$'+IvaCalculo,  bold:true}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', 
                { fillColor: '#FFFFFF', text: 'Total', bold:true }, 
                { fillColor: '#FFFFFF', text: '$'+TotalFinalPdf,  bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }],
                                                //Fin cuadro negritas
                
                //Inicio cuadro negritas
                                                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                                                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                                                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }],

              ]
                                                              //Fin cuadro negritas

            },
			layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},

			}
		},
       
    ],
    

    pageSize: {
        width: 800,  // Establece el ancho personalizado en unidades (por ejemplo, 1000 unidades)
        height: 1230  // 'auto' para mantener la altura proporcional al contenido
      },
      
	styles: {
            redText: {
              color: 'red'
            },
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15],
			alignment: 'center',
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black',
			alignment: 'center'
		},
        defaultStyle: {
		columnGap: 15
	}
	},
	defaultStyle: {
		// alignment: 'justify'
	}


	
}

   



//accessKeyId: process.env.accessKeyId
//secretAccessKey: process.env.secretAccessKey,


/*
       const printer = new PdfPrinter(fonts);
   
       let pdfDoc = printer.createPdfKitDocument(docDefinition);
       pdfDoc.pipe(fs.createWriteStream('pdfs/'+IdTransaccion+`${req.query.codigo}`+'.pdf'));
       pdfDoc.end();

*/


const printer = new PdfPrinter(fonts);

AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  });
       const pdfDoc = printer.createPdfKitDocument(docDefinition);

       // Generate a unique file name for the PDF
       const fileName = `pdfs/${IdTransaccion}${req.query.codigo}.pdf`;
       console.log(fileName + '1')
       // Pipe the PDF to a writable stream (in memory)
       const chunks = [];
       pdfDoc.on("data", (chunk) => chunks.push(chunk));
       pdfDoc.on("end", () => {
         // Convert the chunks to a single Buffer
         const pdfBuffer = Buffer.concat(chunks);
     
         // Upload the PDF to Amazon S3
         const s3 = new AWS.S3();
         const bucketName = "welderstonebucket"; // Replace with your S3 bucket name
         const s3Params = {
           Bucket: bucketName,
           Key: fileName,
           Body: pdfBuffer,
         };
     
         s3.upload(s3Params, (err, data) => {
           if (err) {
             console.error("Error uploading PDF to S3:", err);
            console.log({ error: "Failed to upload PDF to S3" });
           } else {
             console.log("PDF uploaded to S3 successfully:", data.Location);
             console.log({ message: "PDF generated and uploaded successfully!", pdfUrl: data.Location });
           }
         });
       });
     
       // Close the PDF stream
       pdfDoc.end();

      
  



      
    let role = "viewer";

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
       const IdUsuario = req.session.passport.user.id;
       const IdTransaccion = req.query.IdTrans
const ProductoParaCotizar = ProductosAgregar[0][0]

var MaterialesMostrar = []

for (b=0; b<PreciosMateriales.length; b++){
    if (PreciosMateriales[b] !== '\n\n'){
        MaterialesMostrar.push(PreciosMateriales[b])

    }

}

MaterialSuma = MaterialSuma.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');


    res.render('pdfProducto',{IdUsuario, roles: role,loggedIn: true,IdTransaccion,productodatos,ProductoParaCotizar,MaterialesMostrar,MaterialSuma,Total1R,SubTotalR,TotalFinal,TotalFinalR,Total1RFormateado,MaterialSumaRFormateado,HerrMenor,HerramientaMenor,y,indirectosPrecio,indirectosPrecio2,IvaCalculo
    })




}



}


/*
const pdfDescargar = require('../controllers/descargar')
const PdfPrinter = require("pdfmake")
const fs = require("fs")
const fonts = require("../pdf/fonts")
const styles = require("../pdf/styles")
const Product = require("../models/Productos");
const Material = require('../models/materiales.js');
//const moment = require('moment');


module.exports = async (req, res) =>{

       //console.log( req.query.IdTrans)
       const IdTransaccion = req.query.IdTrans
       const materiales= await Material.find({})
       var ProductosAgregar = [];
       var Almacen;
    Almacen = await Product.find({Codigo:req.query.codigo})

    ProductosAgregar.push(Almacen)



    ProductosAgregar[0][0] === Almacen

var productodatos = Almacen;
//console.log(productodatos[0])
var DescripcionPDf =  productodatos[0].descripcion
const FechaCompra =new Date();

var date =
FechaCompra.getFullYear() +
"-" +
(FechaCompra.getMonth() + 1) +
"-" +
FechaCompra.getDate();

//date = moment(date, 'D-M-YY').format('D/M/YY');

var caduca =
FechaCompra.getFullYear() +
"-" +
(FechaCompra.getMonth() + 2) +
"-" +
FechaCompra.getDate();

//caduca = moment(caduca, 'D-M-YY').format('D/M/YY');

const NomProd= productodatos[0].nombre
const CantidadProd= productodatos[0].cantidad
const precioProd= productodatos[0].precio
const unidadProd = productodatos[0].unidad
const Importe = CantidadProd*precioProd


const codigo = productodatos[0].Codigo

var imagen;

if(productodatos[0].image === "" || productodatos[0].image === undefined){

    imagen = '/images/productos/PorDefecto.jpg'
}else{
    imagen = productodatos[0].image.toString()

}

const productosMaterialesDescripcion =[];
       try{

       for(let i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){

        productosMaterialesDescripcion.push(ProductosAgregar[0][0].MaterialesProductos[i].Descripcion)


       }
    }catch(e){
        console.log(error)
    }
    
 
       const productosMaterialesCodigo =[];
       try{
  
       for(let i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){

        productosMaterialesCodigo.push(ProductosAgregar[0][0].MaterialesProductos[i].Codigo)

       }
    }catch(e){
        console.log(error)
    }
       const productosMaterialesCantidad =[];
       try{

       for(let i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){

        productosMaterialesCantidad.push(ProductosAgregar[0][0].MaterialesProductos[i].cantidad)


       }
    }catch(e){
        console.log(error)
    }
       const ProductosMaterialesPrecio =[]

       try{

       for(j=0; j<materiales.length; j++){

       for(i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){
        if(ProductosAgregar[0][0].MaterialesProductos[i].Descripcion === materiales[j].Descripcion ){

            ProductosMaterialesPrecio.push(materiales[j].PrecioUnitario)

        }

       }

    }
}catch(e){
    console.log(error)
}

    var PreciosMateriales =[]
       try{

for (b=0; b<ProductosMaterialesPrecio.length; b++){
    if (ProductosMaterialesPrecio[b] !== '\n\n'){
        PreciosMateriales.push(ProductosMaterialesPrecio[b].toFixed(2))

    }

}

}catch(e){
    console.log(error)
}

    const ProductosMaterialesUnidad =[]

    try{

    for(j=0; j<materiales.length; j++){

    for(i=0; i<ProductosAgregar[0][0].MaterialesProductos.length; i++){
     if(ProductosAgregar[0][0].MaterialesProductos[i].Descripcion === materiales[j].Descripcion ){

        ProductosMaterialesUnidad.push(materiales[j].Unidad)

     }

    }

 }
}catch(e){
    console.log(error)
}


const ImporteMaterial=[]
try{

for(i=0; i<ProductosMaterialesPrecio.length; i++){
if(ProductosMaterialesPrecio[i] >0 && ProductosMaterialesPrecio[i] !== '\n\n' && productosMaterialesCantidad[i]>0 && productosMaterialesCantidad[i] !=='\n\n'){
    ImporteMaterial.push(ProductosMaterialesPrecio[i]*productosMaterialesCantidad[i])
}
}
}catch(e){
    console.log(error)
}

var ImporteMateriales=[]
try{

for (a =0; a<ImporteMaterial.length; a++ ){
ImporteMateriales.push(ImporteMaterial[a].toFixed(2))
}
}catch(e){
    console.log(error)
}
 const productosPinturaDescripcion =[];
 try{

 for(let i=0; i<ProductosAgregar[0][0].PinturaProductos.length; i++){

    productosPinturaDescripcion.push(ProductosAgregar[0][0].PinturaProductos[i].Descripcion)


 }
}catch(e){
    console.log(error)
}
 const productosPinturaCodigo =[];
 try{

 for(let i=0; i<ProductosAgregar[0][0].PinturaProductos.length; i++){

    productosPinturaCodigo.push(ProductosAgregar[0][0].PinturaProductos[i].Codigo)

 }
}catch(e){
    console.log(error)
}
 const productosPinturaCantidad =[];
 try{

 for(let i=0; i<ProductosAgregar[0][0].PinturaProductos.length; i++){

    productosPinturaCantidad.push(ProductosAgregar[0][0].PinturaProductos[i].cantidad)

 }
}catch(e){
    console.log(error)
}

 const ProductosPinturasPrecio =[]
 try{

 for(j=0; j<materiales.length; j++){

 for(i=0; i<ProductosAgregar[0][0].PinturaProductos.length; i++){
  if(ProductosAgregar[0][0].PinturaProductos[i].Descripcion === materiales[j].Descripcion ){

    ProductosPinturasPrecio.push(materiales[j].PrecioUnitario)

  }

 }

}
}catch(e){
    console.log(error)
}


console.log(ProductosPinturasPrecio)
var PreciosPintura =[]
try{

for (b=0; b<ProductosPinturasPrecio.length; b++){
    if (ProductosPinturasPrecio[b] !== '\n\n'){
        PreciosPintura.push(ProductosPinturasPrecio[b].toFixed(2))

    }

}
console.log(PreciosPintura)
}catch(e){
    console.log(error)
}

const ProductosPinturasUnidad =[]
try{

for(j=0; j<materiales.length; j++){

for(i=0; i<ProductosAgregar[0][0].PinturaProductos.length; i++){
 if(ProductosAgregar[0][0].PinturaProductos[i].Descripcion === materiales[j].Descripcion ){

    ProductosPinturasUnidad.push(materiales[j].Unidad)

 }

}

}

}catch(e){
    console.log(error)
}




const ImportePintura=[]
try{

for(i=0; i<ProductosPinturasPrecio.length; i++){
    if(ProductosPinturasPrecio[i] >0 && ProductosPinturasPrecio[i] !== '\n\n' && productosPinturaCantidad[i]>0 && productosPinturaCantidad[i] !=='\n\n'){

    ImportePintura.push(ProductosPinturasPrecio[i]*productosPinturaCantidad[i])
    }
}
}catch(e){
    console.log(error)
}



var ImportePinturas=[]
try{

for (a =0; a<ImportePintura.length; a++ ){
    ImportePinturas.push(ImportePintura[a].toFixed(2))
}


}catch(e){
    console.log(error)
}





 const productosInstalacionDescripcion =[];
 try{

 for(let i=0; i<ProductosAgregar[0][0].InstalacionProductos.length; i++){

    productosInstalacionDescripcion.push(ProductosAgregar[0][0].InstalacionProductos[i].Descripcion)


 }
}catch(e){
    console.log(error)
}



 const productosInstalacionCodigo =[];
 try{

 for(let i=0; i<ProductosAgregar[0][0].InstalacionProductos.length; i++){

    productosInstalacionCodigo.push(ProductosAgregar[0][0].InstalacionProductos[i].Codigo)

 }
}catch(e){
    console.log(error)
}


 const productosInstalacionCantidad =[];
 try{

 for(let i=0; i<ProductosAgregar[0][0].InstalacionProductos.length; i++){

    productosInstalacionCantidad.push(ProductosAgregar[0][0].InstalacionProductos[i].cantidad)



 }
}catch(e){
    console.log(error)
}

 const ProductosInstalacionPrecio =[]
 try{

 for(j=0; j<materiales.length; j++){

 for(i=0; i<ProductosAgregar[0][0].InstalacionProductos.length; i++){
  if(ProductosAgregar[0][0].InstalacionProductos[i].Descripcion === materiales[j].Descripcion ){

    ProductosInstalacionPrecio.push(materiales[j].PrecioUnitario)

  }

 }

}
}catch(e){
    console.log(error)
}
var PreciosInstalaciones =[]
try{

for (b=0; b<ProductosInstalacionPrecio.length; b++){
    if (ProductosInstalacionPrecio[b] !== '\n\n'){
        PreciosInstalaciones.push(ProductosInstalacionPrecio[b].toFixed(2))

    }

}
}catch(e){
    console.log(error)
}

const ProductosInstalacionUnidad =[]
try{

for(j=0; j<materiales.length; j++){

for(i=0; i<ProductosAgregar[0][0].InstalacionProductos.length; i++){
 if(ProductosAgregar[0][0].InstalacionProductos[i].Descripcion === materiales[j].Descripcion ){

    ProductosInstalacionUnidad.push(materiales[j].Unidad)

 }

}

}
}catch(e){
    console.log(error)
}

const ImporteInstalacion=[]
try{

for(i=0; i<ProductosInstalacionPrecio.length; i++){
    if(ProductosInstalacionPrecio[i] >0 && ProductosInstalacionPrecio[i] !== '\n\n' && productosInstalacionCantidad[i]>0 && productosInstalacionCantidad[i] !=='\n\n'){

    ImporteInstalacion.push(ProductosInstalacionPrecio[i]*productosInstalacionCantidad[i])
    }
}
}catch(e){
    console.log(error)
}
var ImporteInstalaciones=[]
try{

for (a =0; a<ImporteInstalacion.length; a++ ){
    ImporteInstalaciones.push(ImporteInstalacion[a].toFixed(2))
}

}catch(e){
    console.log(error)
}




var MaterialSuma= 0 ;
try{
for (c=0; c<ImporteMateriales.length; c++){
    MaterialSuma=MaterialSuma+Number(ImporteMateriales[c])
}
}catch(e){

}
var MaterialSumaR = MaterialSuma.toFixed(2)

var PinturaSuma = 0;
var PinturaSumaRedondeada= 0;
try{
for (c=0; c<ImportePinturas.length; c++){
    PinturaSuma=PinturaSuma+Number(ImportePinturas[c])

}
 PinturaSumaRedondeada = Number(PinturaSuma).toFixed(2)

}catch(e){

}

var InstalacionSuma = 0;
try{
for (c=0; c<ImporteInstalaciones.length; c++){
    InstalacionSuma=InstalacionSuma+Number(ImporteInstalaciones[c])
}

}catch(e){

}
var ManoObMaterial = 0;
if (ProductosAgregar[0][0].ManoObMaterial !== 0){
 ManoObMaterial = ProductosAgregar[0][0].ManoObMaterial;

}
var PorcentajeMaterial = 0;
if(ProductosAgregar[0][0].PorcentajeMaterial !== 0){
    PorcentajeMaterial=ProductosAgregar[0][0].PorcentajeMaterial;
}
var ManoObPintura = 0;
if(ProductosAgregar[0][0].ManoObPintura !== 0){
    ManoObPintura=ProductosAgregar[0][0].ManoObPintura;
}

var PorcentajePintura = 0;
if(ProductosAgregar[0][0].PorcentajePintura !== 0){
    PorcentajePintura=ProductosAgregar[0][0].PorcentajePintura;
}

var ManoObInstalacion = 0;
if(ProductosAgregar[0][0].ManoObInstalacion !== 0){
    ManoObInstalacion=ProductosAgregar[0][0].ManoObInstalacion;
}

var PorcentajeInstalacion = 0;
if(ProductosAgregar[0][0].PorcentajeInstalacion !== 0){
    PorcentajeInstalacion=ProductosAgregar[0][0].PorcentajeInstalacion;
}

var ManoObMaterial1 = (ManoObMaterial/100) * MaterialSuma

const ManoObMaterial1R = Number(ManoObMaterial1).toFixed(2)

var ManoObMaterial2 =(PorcentajeMaterial/100) * (MaterialSuma+ManoObMaterial1)

const ManoObMaterial2R = Number(ManoObMaterial2).toFixed(2)

var Total1 = MaterialSuma+ ManoObMaterial1+ManoObMaterial2

const Total1R = Number(Total1).toFixed(2)

var ManoObPintura1 = (ManoObPintura/100) * PinturaSuma

const ManoObPintura1R = Number(ManoObPintura1).toFixed(2)

var ManoObPintura2 =(PorcentajePintura/100) * (PinturaSuma+ManoObPintura1)

const ManoObPintura2R = Number(ManoObPintura2).toFixed(2)

var Total2 = PinturaSuma+ ManoObPintura1+ManoObPintura2

const Total2R = Number(Total2).toFixed(2)

var ManoObInstalacion1 = (ManoObInstalacion/100) * InstalacionSuma

const ManoObInstalacion1R = Number(ManoObInstalacion1).toFixed(2)

var ManoObInstalacion2 =(PorcentajeInstalacion/100) * (InstalacionSuma+ManoObInstalacion1)

const ManoObInstalacion2R = Number(ManoObInstalacion2).toFixed(2)

var Total3 = InstalacionSuma+ ManoObInstalacion1+ManoObInstalacion2

const Total3R = Number(Total3).toFixed(2)
//.toFixed(2)

const iva = productodatos[0].iva

const SubTotal = Total1+ Total2 +Total3 

const SubTotalR = Number(SubTotal).toFixed(2)

const TotalFinal = Number(SubTotalR) +(Number(SubTotalR)*(Number(iva)/100))

var TotalFinalR = Number(TotalFinal).toFixed(2)
function formatNumber(value) {
    var formatter = new Intl.NumberFormat('en-US');
    return formatter.format(value);
  }
  
// Formatear los arrays de precios e importes
var preciosFormateados = PreciosMateriales.map(formatNumber);
var importesFormateados = ImporteMateriales.map(formatNumber);
// Formatear los arrays de precios e importes
var preciosFormateados2 = PreciosPintura.map(formatNumber);
var importesFormateados2 = ImportePinturas.map(formatNumber);// Formatear los arrays de precios e importes
var preciosFormateados3 = PreciosInstalaciones.map(formatNumber);
var importesFormateados3 = ImporteInstalaciones.map(formatNumber);

// Función para formatear y redondear números a 2 decimales
function formatNumberWithDecimals(value) {
    var roundedValue = parseFloat(value).toFixed(2);
    return formatNumber(roundedValue);
  }
  
  // Formatear el valor de MaterialSumaR con separación de miles y redondeo a 2 decimales
  var MaterialSumaRFormateado = formatNumberWithDecimals(MaterialSumaR);

var ManoObMaterial1RFormateado = formatNumberWithDecimals(ManoObMaterial1R)

var ManoObMaterial2RFormateado =formatNumberWithDecimals(ManoObMaterial2R)

var Total1RFormateado = formatNumberWithDecimals(Total1R)
var  PinturaSumaRedondeadaFormateado = formatNumberWithDecimals(PinturaSumaRedondeada)
var ManoObPintura1RFormateado = formatNumberWithDecimals(ManoObPintura1R)
var ManoObPintura2RFormateado = formatNumberWithDecimals(ManoObPintura2R)
var Total2RFormateado = formatNumberWithDecimals(Total2R)
var InstalacionSumaFormateado  = formatNumberWithDecimals(InstalacionSuma)
var ManoObInstalacion1RFormateado = formatNumberWithDecimals(ManoObInstalacion1R)
var ManoObInstalacion2RFormateado = formatNumberWithDecimals(ManoObInstalacion2R)
var Total3RFormateado = formatNumberWithDecimals(Total3R)
var SubTotalRFormateado = formatNumberWithDecimals(SubTotalR)
var TotalFinalRFormateado = formatNumberWithDecimals(TotalFinalR)
var ivaDesgloce = ((iva/100)*Number(SubTotalR))
var ivaDesgloceFormateado = formatNumberWithDecimals(ivaDesgloce)
       let docDefinition ={

    content :[
      
       
        {columns:[{image:'./public/images/productos/welderstone.png',width: 160, alignment:'left'},{},{image:'./public'+imagen,width: 80, height:80,alignment:'center',fit: [230,230], absolutePosition: {x: 50, y: 10}},{text: 'Cotización', style: 'header',	alignment: 'right'}]},
        
            {
                style: 'tableExample',
                layout: 'noBorders', // Utilizamos 'noBorders' en lugar de 'auto' para eliminar los bordes de la tabla
                table: {
                  widths: [80, 80, 80],
                  body: [
                    [
                      { text: 'Fecha', style: 'tableHeader', alignment: 'left' },
                      { text: date, alignment: 'left' },
                    ],
                    [
                      { text: 'Codigo', style: 'tableHeader', alignment: 'left' },
                      { text: codigo, alignment: 'left' },
                    ],
                    [
                      { text: 'Valido hasta', style: 'tableHeader', alignment: 'left' },
                      { text: caduca, alignment: 'left' },
                    ],
                  ],
                },
                absolutePosition: { x: 600, y: 80 },
              },
{text: ['Sitio web: www.Welderstone.com\n','Teléfono: 87-12-64-69-82 \n','E-mail: Welderstone@outlook.com'], margin: [0, 20,]},
{
    text: [
      { text: 'Descripción del producto\n', style: 'redText' },
      DescripcionPDf
    ],
    margin: [0, 20]
  }
,  
	{
			alignment: 'center',
			columns: [
				 {  width: 300,
					text: '',
					alignment: 'center',
				}
			]
		},
        { text: '\n' },
        {
            style: 'tableExample',
            alignment: 'center',
            table: {
              headerRows: 1,
              alignment: 'center',
              widths: ['*', 280, '*', '*', '*', '*'],
              body: [
                [
                    { text: 'Codigo', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Material', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Unidad', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Cantidad', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'Precio Unitario', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'importe', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' }
                  ],
                ...(productosMaterialesDescripcion.map((desc, i) => [
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosMaterialesCodigo[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: desc, alignment: 'left'},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: ProductosMaterialesUnidad[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosMaterialesCantidad[i]},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+preciosFormateados[i]},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+importesFormateados[i] }
                ])),  
  
                
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: 'Material', bold:true }, 
                { fillColor: '#F2F2F2', text: 'Suma' ,  bold:true}, { fillColor: '#F2F2F2', text: '$'+MaterialSumaRFormateado , bold:true}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', { fillColor: '#FFFFFF', text: 'Mano de obra' ,  bold:true}, 
                { fillColor: '#FFFFFF', text: ManoObMaterial + '%',  bold:true}, 
                { fillColor: '#FFFFFF', text: '$'+ManoObMaterial1RFormateado,  bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: 'Indirectos' , bold:true}, 
                { fillColor: '#F2F2F2', text: PorcentajeMaterial + '%', bold:true}, 
                { fillColor: '#F2F2F2', text: '$'+ManoObMaterial2RFormateado}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', 
                { fillColor: '#FFFFFF', text: 'Total', bold:true }, 
                { fillColor: '#FFFFFF', text: '$'+Total1RFormateado,  bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }],


                ...(productosPinturaDescripcion.map((desc, i) => [
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosPinturaCodigo[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: desc , alignment: 'left'},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: ProductosPinturasUnidad[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosPinturaCantidad[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text:  '$'+preciosFormateados2[i]},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+importesFormateados2[i] }
                ])),


                [{ fillColor: '#F2F2F2', text: ' ' },{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: 'Pintura' , bold:true}, { fillColor: '#F2F2F2', text: 'Suma' , bold:true}, { fillColor: '#F2F2F2', text: '$'+PinturaSumaRedondeadaFormateado , bold:true}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', { fillColor: '#FFFFFF', text: 'Mano de obra' , bold:true}, { fillColor: '#FFFFFF', text: ManoObPintura + '%' , bold:true}, { fillColor: '#FFFFFF', text: '$'+ManoObPintura1RFormateado , bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' },{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: 'Indirectos', bold:true }, { fillColor: '#F2F2F2', text: PorcentajePintura + '%', bold:true }, { fillColor: '#F2F2F2', text: '$'+ManoObPintura2RFormateado, bold:true }],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', { fillColor: '#FFFFFF', text: 'Total', bold:true }, { fillColor: '#FFFFFF', text: '$'+Total2RFormateado, bold:true }],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }],

                                                //Fin cuadro negritas

                ...(productosInstalacionDescripcion.map((desc, i) => [
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: productosInstalacionCodigo[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: desc, alignment: 'left' },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: ProductosInstalacionUnidad[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text:  productosInstalacionCantidad[i]},
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+preciosFormateados3[i] },
                  { fillColor: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2', fontSize: 10, text: '$'+importesFormateados3[i] }
                ])),

                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: 'Instalación', bold:true }, { fillColor: '#F2F2F2', text: 'Suma' , bold:true}, { fillColor: '#F2F2F2', text: '$'+InstalacionSumaFormateado , bold:true}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', { fillColor: '#FFFFFF', text: 'Mano de obra' , bold:true}, { fillColor: '#FFFFFF', text: ManoObInstalacion + '%' , bold:true}, { fillColor: '#FFFFFF', text: '$'+ManoObInstalacion1RFormateado, bold:true }],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' },{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: 'Indirectos', bold:true }, { fillColor: '#F2F2F2', text: PorcentajeInstalacion + '%' , bold:true}, { fillColor: '#F2F2F2', text: '$'+ManoObInstalacion2RFormateado , bold:true}],
                                                //Inicio cuadro negritas
                                                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                                                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, 
                                                { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', { fillColor: '#FFFFFF', text: 'Total', bold:true }, { fillColor: '#FFFFFF', text: '$'+Total3RFormateado , bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' },{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: 'Subtotal' , bold:true}, { fillColor: '#F2F2F2', text: '$'+SubTotalRFormateado , bold:true}],
                [{ fillColor: '#FFFFFF', text: ' ' }, ' ', ' ', ' ', { fillColor: '#FFFFFF', text: 'Iva' , bold:true}, { fillColor: '#FFFFFF', text: '$'+ivaDesgloceFormateado  , bold:true}],
                [{ fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: ' ' }, { fillColor: '#F2F2F2', text: 'Total', bold:true }, { fillColor: '#F2F2F2', text: '$'+TotalFinalRFormateado , bold:true}],
              ]
                                                              //Fin cuadro negritas

            },
			layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},

			}
		},
       
    ],
    

    pageSize: {
        width: 800,  // Establece el ancho personalizado en unidades (por ejemplo, 1000 unidades)
        height: 1230  // 'auto' para mantener la altura proporcional al contenido
      },
      
	styles: {
            redText: {
              color: 'red'
            },
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15],
			alignment: 'center',
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black',
			alignment: 'center'
		},
        defaultStyle: {
		columnGap: 15
	}
	},
	defaultStyle: {
		// alignment: 'justify'
	}


	
}

   



//accessKeyId: process.env.accessKeyId
//secretAccessKey: process.env.secretAccessKey,


/*
       const printer = new PdfPrinter(fonts);
   
       let pdfDoc = printer.createPdfKitDocument(docDefinition);
       pdfDoc.pipe(fs.createWriteStream('pdfs/'+IdTransaccion+`${req.query.codigo}`+'.pdf'));
       pdfDoc.end();

*/

/*
const AWS = require('aws-sdk');
const printer = new PdfPrinter(fonts);

AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  });
       const pdfDoc = printer.createPdfKitDocument(docDefinition);

       const fileName = `pdfs/${IdTransaccion}${req.query.codigo}.pdf`;
       console.log(fileName + '1')
       const chunks = [];
       pdfDoc.on("data", (chunk) => chunks.push(chunk));
       pdfDoc.on("end", () => {
         const pdfBuffer = Buffer.concat(chunks);
     
         const s3 = new AWS.S3();
         const bucketName = "welderstonebucket"; // Replace with your S3 bucket name
         const s3Params = {
           Bucket: bucketName,
           Key: fileName,
           Body: pdfBuffer,
         };
     
         s3.upload(s3Params, (err, data) => {
           if (err) {
             console.error("Error uploading PDF to S3:", err);
            console.log({ error: "Failed to upload PDF to S3" });
           } else {
             console.log("PDF uploaded to S3 successfully:", data.Location);
             console.log({ message: "PDF generated and uploaded successfully!", pdfUrl: data.Location });
           }
         });
       });
     
       pdfDoc.end();

      
  



      
    let role = "viewer";

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
       const IdUsuario = req.session.passport.user.id;
       const IdTransaccion = req.query.IdTrans
const ProductoParaCotizar = ProductosAgregar[0][0]

var MaterialesMostrar = []
var PinturaMostrar = []

var InstalacionesMostrar = []
for (b=0; b<PreciosMateriales.length; b++){
    if (PreciosMateriales[b] !== '\n\n'){
        MaterialesMostrar.push(PreciosMateriales[b])

    }

}
for (b=0; b<PreciosPintura.length; b++){
    if (PreciosPintura[b] !== '\n\n'){
        PinturaMostrar.push(PreciosPintura[b])

    }

}
for (b=0; b<PreciosInstalaciones.length; b++){
    if (PreciosInstalaciones[b] !== '\n\n'){
        InstalacionesMostrar.push(PreciosInstalaciones[b])

    }

}

    res.render('pdfProducto',{IdUsuario, roles: role,loggedIn: true,IdTransaccion,productodatos,ProductoParaCotizar,MaterialesMostrar,PinturaMostrar,InstalacionesMostrar,MaterialSuma,ManoObMaterial1R,ManoObMaterial2R,Total1R,PinturaSumaRedondeada,ManoObPintura1R,ManoObPintura2R,Total2R,InstalacionSuma,ManoObInstalacion1R,ManoObInstalacion2R,Total3R,SubTotalR,TotalFinal,TotalFinalR})




}



}

*/