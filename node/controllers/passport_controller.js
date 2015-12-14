// expose this function to our app using module.exports
module.exports = function (passport) {
    'use strict';
    // declare and initialize variables
    var path = require('path'),
        LocalStrategy = require('passport-local').Strategy, // load all the things we need
        User = require(path.normalize(__dirname + '/../models/users_model.js')); // load up the user model

    // passport session setup =============================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // local signup =======================================
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup',
            new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
            function (req, email, password, done) {
        var returnValue;
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function () {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({'local.email': email}, function (err, user) {
                if (err) { // if there are any errors, return the error
                    returnValue = done(err);
                } else if (user) { // check to see if theres already a user with that email
                    returnValue = done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that email and password=========================
                    // create the user
                    var thisDate,
                        newUser = new User();
                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.handle = email;
                    newUser.local.account_type = 9;
                    thisDate = Date.now();
                    newUser.user_profile.created = thisDate;
                    newUser.user_profile.updated = thisDate;

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        returnValue = done(null, newUser);
                    });
                            //=============================================================================


                }
                return returnValue;
            });
        });
    }));

    // local login ========================================
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login',
            new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
            function (req, email, password, done) { // callback with email and password from the form

        // find a user
        User.findOne({'local.email': email}, function (err, user) {
            var returnValue;
            if (err) { // if there are any errors, return the error
                returnValue = done(err);
            } else if (!user) { // if no user is found, return the message
                returnValue = done(null, false, req.flash('loginMessage', 'No email found.'));
            } else if (!user.validPassword(password)) { // if the user is found but the password is wrong
                returnValue = done(null, false, req.flash('loginMessage', 'Wrong password.'));
            } else { // if user is found and password is correct
                returnValue = done(null, user);
            }
            return returnValue; // return the findings
        });
    }));

};