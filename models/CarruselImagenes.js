const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');
const mongoosePaginate = require('mongoose-paginate-v2');

const CarruselImagenesSchema = new Schema(
    {

  
carrusel:{type: String,},
        image: { type: String, default: '' },
        image2: { type: String, default: '' },
        image3: { type: String, default: '' },
        image4: { type: String, default: '' },
        image5: { type: String, default: '' },
        image6: { type: String, default: '' },
        image7: { type: String, default: '' },
        image8: { type: String, default: '' },
        image9: { type: String, default: '' },
        image10: { type: String, default: '' },
        image11: { type: String, default: '' },
        image12: { type: String, default: '' },

    }
);

CarruselImagenesSchema.plugin(mongoosePaginate);
const CarruselImagenes = mongoose.model('CarruselImagenes', CarruselImagenesSchema);
module.exports = CarruselImagenes;

/*

*/
