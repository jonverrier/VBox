'use strict';

var path = require('path');
var express = require('express');
var errorHandler = require('errorhandler');
var compression = require('compression');
var pageRouter = require('./page-routes.js');

// Control variables for development / production
var inDevelopment = false;
if (process.env.NODE_ENV === 'development') {
   inDevelopment = true;
   console.log('Using development options');
} else {
   console.log('Using production options');
}

// Initialize status middleware - files, cache etc
// Set cache parameter to one day unless in development, and include 'dev' directory if we are in development mode
// Note: do this BEFORE adding sessions, else sessions get called multiple times, 
// once for each asset including static ones
var cacheAge = 86400000; // 86400000 is One Day

// Insert versioning middleware before static
var currentVersion = '0.1';
var versionator = require('versionator').create(currentVersion);

var app = express();

// Use versionator & compression for staic files
app.version = currentVersion;
app.use(versionator.middleware);
//app.use(compression());

// Allow files from ./public and ./dist to be used 
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));

if (inDevelopment) {
   // Set error handler. 
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));

   // Allow files from ./src directory to be used 
   app.use(express.static(path.join(__dirname, '/client')));

   // Allow files from ./test directory to be used 
   app.use(express.static(path.join(__dirname, '/test')));
} 

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);

// Routes for user pages
app.use('/', pageRouter);

//redirect root to Login
app.get('/', function (req, res) {
   return res.redirect('/login');
});

var server = app.listen(app.get('port'), function () {
   console.log('listening');
});
