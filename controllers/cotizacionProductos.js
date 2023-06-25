const Cotizaciones = require('../models/cotizaciones');
const pdfDescargar = require('../controllers/descargar');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const fonts = require('../pdf/fonts');
const styles = require('../pdf/styles');
const Product = require('../models/Productos');
const Material = require('../models/materiales.js');

module.exports = async (req, res) => {
    const IdTransaccion = req.query.IdTrans;
    const materiales = await Material.find({});
    const PdfDescargar = await Cotizaciones.find({
        Id_transaccion: req.query.IdTrans,
    });

    const { ProductosComprados } = PdfDescargar[0];

    console.log(ProductosComprados);

    const body = [];

    for (const producto of ProductosComprados) {
        const { nombre, codigo, unidad, precio, cantidad, iva } = producto;

        const fila = [
            { text: codigo, fontSize: 11 },
            { text: nombre, fontSize: 11 },
            { text: unidad, fontSize: 11 },
            { text: precio.toLocaleString(), fontSize: 11 },
            { text: cantidad.toString(), fontSize: 11 },
            { text: (precio * cantidad).toLocaleString(), fontSize: 11 },
        ];

        body.push(fila);
    }
    // console.log(body)

    const FechaCompra = PdfDescargar[0].Fecha_compra;

    const date =
        FechaCompra.getFullYear() +
        '-' +
        (FechaCompra.getMonth() + 1) +
        '-' +
        FechaCompra.getDate();

    const caduca =
        FechaCompra.getFullYear() +
        '-' +
        (FechaCompra.getMonth() + 2) +
        '-' +
        FechaCompra.getDate();

    const docDefinition = {
        content: [
            {
                columns: [
                    {
                        image: './public/images/productos/welderstone2.png',
                        width: 450,
                        heigth:30,
                        absolutePosition: { x: 45, y: 30 },
                    },
                ],
            },

            {
                style: 'tableExample',
                layout: 'noBorders',
                table: {
                    widths: [70, 70],
                    body: [
                        [
                            { text: 'Fecha: ', style: ['tableHeader', 'redText'], alignment: 'left', fontSize: 14 },
                            { text: date, alignment: 'left', fontSize: 14 },
                        ],
                    ],
                },
                absolutePosition: { x: 619, y: 90 },
            },
            { text: '\n' },


            {
                alignment: 'center',
                columns: [
                    {
                        width: 300,
                        text: '',
                        alignment: 'center',
                    },
                ],
            },

            { text: '\n' },
            { text: '\n' },
            { text: '\n' },
            { text: '\n' },
            { text: '\n' },


            {
                style: 'tableExample',
                alignment: 'center',
                table: {
                    headerRows: 1,
                    alignment: 'center',
                    widths: ['*', '*', '*', '*', '*', '*'],

                    body: [
                        [
                            { text: 'Codigo', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                            { text: 'Material', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                            { text: 'Unidad', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                            { text: 'Cantidad', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                            { text: 'Precio Unitario', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' },
                            { text: 'importe', style: 'tableHeader', fillColor: '#000000', color: '#FFFFFF' }
                          ],
                        ...body,
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' '],
                    ],
                },

                layout: {
                    hLineWidth: function (i, node) {
                        return i === 0 || i === node.table.body.length ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return i === 0 || i === node.table.widths.length
                            ? 2
                            : 1;
                    },
                    hLineColor: function (i, node) {
                        return i === 0 || i === node.table.body.length
                            ? 'black'
                            : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return i === 0 || i === node.table.widths.length
                            ? 'black'
                            : 'gray';
                    },
                },
            },
            { text: '\n' },
            { text: '\n' },
            { text: '\n' },
            {
                fontSize: 11,
                text: [
                    'Arq. José Ángel Aguiler \n',
                    'Cel: 871-131-01-92 \n',
                ],
                margin: [0, 20, 0, 8],
            },
            {
                fontSize: 11,
                text: [
                    'Si usted tiene alguna pregunta sobre esta cotización, por favor, póngase en contacto con nosotros \n',
                    'Sitio web: www.Welderstone.com | Teléfono: 87-12-64-69-82 | E-mail: Welderstone@outlook.com \n',
                ],
                alignment: 'center',
            },
        ],
        pageSize: {
            width: 800, // Establece el ancho personalizado en unidades (por ejemplo, 1000 unidades)
            height: 1230, // 'auto' para mantener la altura proporcional al contenido
        },
        styles: {
            redText: {
                color: 'red'
              },
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
            },
            tableExample: {
                margin: [0, 5, 0, 15],
                alignment: 'center',
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
                alignment: 'center',
            },
            defaultStyle: {
                columnGap: 15,
            },
        },
        defaultStyle: {
            // alignment: 'justify'
        },
    };

    const printer = new PdfPrinter(fonts);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdfs/' + IdTransaccion + '.pdf'));
    pdfDoc.end();

    let role = 'viewer';

    if (req.session?.passport?.user != undefined) {
        role = req.session.passport.user.role;
        const IdUsuario = req.session.passport.user.id;
        const IdTransaccion = req.query.IdTrans;
        const cotizaciones = await Cotizaciones.find({});

        const NumeroCliente = PdfDescargar[0].Telefono;

        res.render('cotizacionProducto', {
            IdUsuario,
            cotizaciones,
            roles: role,
            loggedIn: true,
            IdTransaccion,
            NumeroCliente,
            ProductosComprados,
        });
    }
};
