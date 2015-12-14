// variable declaration and initialization ================
var configDB,
    httpPort,
    ejs = require('ejs'),
    path = require('path'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    app = express();

// server configuration ===================================
httpPort = process.env.PORT || 80; // HTTP Port
configDB = require(path.normalize(__dirname + '/../config/database.js')); //Database Config File

// connect to mongoDB
console.log("mongoDB: INITIATING CONNECTION...\n");
mongoose.connect(configDB.url);
mongoose.connection.on('error', console.error.bind(console, 'mongoDB: CONNECTION ERROR'));
mongoose.connection.once('open', function () {
    'use strict';
    console.log("mongoDB: CONNECTED");
});

// passport configuration =================================
require(path.normalize(__dirname + '/controllers/passport_controller'))(passport);

// set up express application =============================
app.use(morgan('dev')); // log requests to the console
app.engine('html', ejs.renderFile); // set up ejs for templating
app.set('view engine', 'html'); // set engine to html
app.set('views', path.normalize(__dirname + '/views')); // set up template location
app.use(bodyParser.urlencoded({extended: true})); // get information from html forms
app.use(bodyParser.json()); // get information from json
app.use(cookieParser()); // read cookies

// required for passport
app.use(expressSession({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in sessions

// routes =================================================
require(path.normalize(__dirname + '/controllers/routes_controller'))(app, passport);

// api ====================================================
require(path.normalize(__dirname + '/controllers/api_controller'))(app);

// http server start ======================================
app.listen(httpPort, function () {
    'use strict';
    console.log("HTTP:    STARTED");
    console.log("HTTP:    LISTENING PORT: " + httpPort);
});