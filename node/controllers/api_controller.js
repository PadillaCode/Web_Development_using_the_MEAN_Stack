var path = require('path'),
    inventory = require(path.normalize(__dirname + '/inventory_controller'));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    'use strict';
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if user is NOT authenticated in the session, redirect to home page
    res.redirect('/public');
}

// route middleware to make sure a user is an administrator
function isAdmin(req, res, next) {
    'use strict';
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.local.account_type >= 0 && req.user.local.account_type <= 2) {
        return next();
    }

    // if user is NOT an admin in the session, redirect to home page
    res.redirect('/accessdenied');

}

module.exports = function (app) {
    'use strict';

    // API: User Database: return user's handle
    app.get('/api/userhandle', isLoggedIn, function (req, res) {
        res.json(req.user.local.handle);
    });

    // API: User Database: return user's email
    app.get('/api/useremail', isLoggedIn, function (req, res) {
        res.json(req.user.local.email);
    });

    // API: User Database: return user's database id
    app.get('/api/userid', isLoggedIn, function (req, res) {
        res.json(req.user._id);
    });

    // API: User Database: return user's account type
    app.get('/api/usertype', isLoggedIn, function (req, res) {
        res.json(req.user.local.account_type);
    });

    app.post('/app/additem', isAdmin, function (req, res) {
        var item = {
            item_name: req.body.item_name,
            quantity: req.body.quantity,
            item_description: req.body.item_description,
            picture_url: req.body.picture_url
        };
        inventory.addItem(req, res, item);
    });

    app.get('/api/getinventory', isLoggedIn, function (req, res) {
        var Inventory = require(path.normalize(__dirname + '/../models/items_model.js')); // load up the inventory model
        Inventory.find({}, function (err, result) {
            if (err) {
                console.log("Database Error: Search thru: " + err);
            }
        console.log(result);
        res.json(result);
        });
    });
};