// declare and initialize variables
var path = require('path'),
    Inventory = require(path.normalize(__dirname + '/../models/items_model.js')); // load up the inventory model

// expose this function to our app using module.exports
module.exports = {

    addItem: function (req, res, item) {
        'use strict';
        var newItem = new Inventory();
        newItem.item_name = item.item_name;
        newItem.quantity = item.quantity;
        newItem.item_description = item.item_description;
        newItem.picture_url = item.picture_url;
        newItem.save(function (err) {
            if (err) {
                console.log("ERROR: addItem Failure: " + err);
            }
        });
        res.redirect('/admin/inventory');
    },

    getInventory: function (callback) {
        'use strict';
        Inventory.find({}, function (err, result) {
            if (err) {
                console.log(err);
                result = null;
            }
            callback(result);
        });
    }
};