
//const {content} = require("../pdf/pdfContent")
const download = require("download")

module.exports = async (req, res) =>{
 

    const IdTransaccion = req.query.IdTrans


    res.download('pdfs/'+IdTransaccion+`${req.query.Codigo}`+'.pdf');


}

