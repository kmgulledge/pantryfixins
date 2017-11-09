console.log("||\u2713  Opened File [./server.js]");

//=========================================================
//=====   Dependencies   ==================================
//=========================================================

var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var configDB = require('./config/database.js');
var session = require('express-session');

//=========================================================
//=====   Configure Express App   =========================
//=========================================================

// Log every request to the console
app.use(logger('dev'));
// Reads Cookies for login Auth
app.use(cookieParser());
// Parse HTML forms for user input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// Set up the Template Engine
app.set('view engine', 'pug');
// Set up Express Passport Auth
app.use(session({
  secret: 'thisisatest',
  resave: true,
  saveUninitialized: true
}));// end app.use(session())
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//=========================================================
//=====   Configure Mongo Database   ======================
//=========================================================

mongoose.connect(configDB.url, { useMongoClient: true }); // connect to our database
var db = mongoose.connection;
require('./config/passport')(passport); // pass passport for configuration
mongoose.Promise = require('bluebird');

//=========================================================
//=====   Run Express App    ==============================
//=========================================================

require('./app/routes.js')(app, passport);
app.listen(port);
console.log('||\u21da\u21db Server is running on port: ' + port);