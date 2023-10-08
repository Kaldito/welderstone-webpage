const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');
const mongoosePaginate = require('mongoose-paginate-v2');

const FacturApiSchema = new Schema({

customer:{
    legal_name:{type:String},
    email:{type:String},
    tax_id:{type:String},
    tax_system:{type:String},
    address:
    {country:{type:String},
    zip:{type:String},
    city:{type:String}}},
items:[{
    quantity:{type:Number},product:{description:{type:String},product_key:{type:String},price:{type:Number},taxes:[{type:{type:String},rate:{type:Number}}]}}],
use:{type:String},
payment_form:{type:String},
payment_method:{type:String},
conditions:{type:String},

});

FacturApiSchema.plugin(mongoosePaginate);
const FacturApi = mongoose.model('FacturApi', FacturApiSchema);
module.exports = FacturApi;
