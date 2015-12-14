// declare and initialize variables
var mongoose = require('mongoose'),
    // define the schema

    itemSchema = mongoose.Schema({
        item_name: {type: String, required: true, unique: true},
        category: {type: String, required: false, unique: false},
        type: {type: String, required: false, unique: false},
        item_description: {type: String, required: true, unique: false, default: "default"},
        picture_url: {type: String, required: true, unique: false, sparse: true, default: "default"},
        upc_barcode: {type: Number, required: false, unique: true, sparse: true},
        quantity: {type: Number, required: true, unique: false, default: 0},
        unit_cost: {type: Number, required: false, unique: false, default: 0},
        unit_price: {type: Number, required: false, unique: false, default: 0}
    });


// create the model for users and expose it to the app
module.exports = mongoose.model('Item', itemSchema);