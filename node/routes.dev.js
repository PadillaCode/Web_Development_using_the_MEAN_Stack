var path = require('path'),
    express = require('express');
    // url = require('url');

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

module.exports = function (app, passport) {
    'use strict';

    // set static paths for web pages =====================
    app.use('/angular', express.static(path.normalize(__dirname + '/../bin/angular')))
        .use('/lib', express.static(path.normalize(__dirname + '/../bin/lib')))
        .use('/css', express.static(path.normalize(__dirname + '/../bin/css')))
        .use('/images', express.static(path.normalize(__dirname + '/../bin/images')));

    // SPLASH SCREEN ======================================
    app.get('/public', function (req, res) {
        var contentPath = path.normalize(__dirname + '/views/ejs/index.html');
        res.render(contentPath, {message: req.flash('rootRequestMessage')});
    });

    // LOGIN ==============================================
    app.get('/login', function (req, res) {
        var contentPath = path.normalize(__dirname + '/views/ejs/login.html');
        res.render(contentPath, {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the main profile section
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =============================================
    app.get('/signup', function (req, res) {
        var contentPath = path.normalize(__dirname + '/views/ejs/signup.html');
        res.render(contentPath, {message: req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the main profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // USER AUTHENTICATED =================================
    app.get('/', isLoggedIn, function (req, res) {
        var contentPath = path.normalize(__dirname + '/views/ejs/main.html');
        res.render(contentPath, {
            user: req.user
        });
    });

    // LOG OUT ============================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/public');
    });

    // API: User Database: user return
    app.get('/api/currentuser', isLoggedIn, function (req, res) {
        res.json(req.user.local.username);
    });
};

