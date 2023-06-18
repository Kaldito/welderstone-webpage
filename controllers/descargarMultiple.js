
const download = require("download")

module.exports = async (req, res) =>{

    const IdTransaccion = req.body.IdTrans

    console.log(req.body.Multiples)
 for (i=0; i<req.body.Multiples.length; i++){


    console.log(req.body.Multiples[i])


    res.download('pdfs/'+IdTransaccion+`${req.body.Multiples[0]}`+'.pdf');

}

}

