const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bodyParser = require('body-parser')
const mongoosePaginate= require('mongoose-paginate-v2')

const AñoSchema = new Schema({

    años:[{año:{type:Number}}],
    valor:{type:String}
    
});

AñoSchema.plugin(mongoosePaginate);
const Año = mongoose.model('Año',AñoSchema);
module.exports = Año;
