var path = require('path'),
    express = require('express');

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

module.exports = function (app, passport) {
    'use strict';

    // set static paths for web pages =====================
    app.use('/angular', express.static(path.normalize(__dirname + '/../../bin/angular')))
        .use('/lib', express.static(path.normalize(__dirname + '/../../bin/lib')))
        .use('/css', express.static(path.normalize(__dirname + '/../../bin/css')))
        .use('/images', express.static(path.normalize(__dirname + '/../../bin/images')));

    // PUBLIC SPLASH SCREEN ===============================
    app.get('/public', function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/public_index.html');
        res.render(contentPath);
    });

    // USER AUTHENTICATED =================================
    app.get('/', isLoggedIn, function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/registered_index.html');
        res.render(contentPath, {
            user: req.user // get the user out of the session and pass it to the template
        });
    });

    // ADMIN SPLASH SCREEN ================================
    app.get('/admin', isAdmin, function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/admin_index.html');
        res.render(contentPath);
    });

    // INVENTORY SCREEN ===================================
    app.get('/admin/inventory', isAdmin, function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/admin_inventory.html'),
            inventoryController = require(path.normalize(__dirname + '/inventory_controller'));

        function resSECOND(item) {
            res.render(contentPath, {
                items: item
            });
        }

        inventoryController.getInventory(resSECOND);
    });

    // REGISTERED LOGIN ===================================
    app.get('/login', function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/public_login.html');
        res.render(contentPath, {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the main profile section
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));

    // ADMIN LOGIN ========================================
    app.get('/login/admin', function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/admin_login.html');
        res.render(contentPath, {message: req.flash('loginMessage')});
    });

    app.post('/login/admin', passport.authenticate('local-login', {
        successRedirect: '/admin', // redirect to the main profile section
        failureRedirect: '/login/admin', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =============================================
    app.get('/signup', function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/public_signup.html');
        res.render(contentPath, {message: req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the main profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // LOG OUT ============================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/public');
    });

    // ADMIN LOG OUT ======================================
    app.get('/logout/admin', function (req, res) {
        req.logout();
        res.redirect('/login/admin');
    });

    // ACCESS DENIED ======================================
    app.get('/accessdenied', function (req, res) {
        var contentPath = path.normalize(__dirname + '/../views/ejs/access_denied.html');
        res.render(contentPath);
    });

};

