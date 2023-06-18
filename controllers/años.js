const Años = require("../models/Años");

module.exports = async (req, res) =>{
    const añocreado = await Años.find({});
    const {años} = añocreado[0];
var AñoNuevo = new Date();
AñoNuevo = AñoNuevo.getFullYear();
for(i=0; i < años.length; i++){
if (AñoNuevo !== años[i].año){
await Años.updateOne({valor:"unico"},{$push:{años:{año:AñoNuevo}}})
}
}

}