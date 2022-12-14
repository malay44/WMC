const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes/index');
const connection = require('./config/database');
const path = require("path");
var cors = require('cors');
var rate_limit = require('express-rate-limit');

// mail

const limiter = rate_limit({
    windowMs: 300000,
    max: 300,
})


const sgMail = require('@sendgrid/mail');
const mails = require('./lib/emails.json');


// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(limiter);
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static(__dirname + '/Public/login-signup'));
// app.use(express.static(__dirname + '/Public/Admin-home'));
app.use("/static", express.static(__dirname + '/Public'));
app.use(cors());



/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
// require('./config/passport');
require('./config/google_passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // console.log("<-------------------------START-------------------------->");
    // // console.log("<-------------------------session details-------------------------->");
    console.log(req.session);
    console.log("<-------------------------user details-------------------------->");
    console.log(req.user);
    // console.log("<-------------------------END-------------------------->");
    next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

if (process.env.NODE_ENV === 'production') {
    
}

const port = process.env.PORT || 3000;
app.listen(port);
