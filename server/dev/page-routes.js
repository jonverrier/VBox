'use strict';
// Copyright TXPCo ltd, 2020, 2021

var path = require('path');
var express = require('express');
var router = express.Router();

var options = {
   root: path.join(__dirname, "..")
};

// Home page route. Client-side does path-based routing. 
router.get('/favicon.ico', function (req, res) {
   res.sendFile('public/weightlifter-b-128x128.png', options);
})

// Home page route. Client-side does path-based routing. 
router.get('/privacy', function (req, res) {
   res.sendFile('public/privacy.html', options);
})

// Home page route. Client-side does path-based routing. 
router.get('/landing', function (req, res) {
   res.sendFile('public/index.html', options);
})

// Member page route. Client-side does path-based routing. 
router.get('/member', function (req, res) {
   res.sendFile('public/index.html', options);
})

// Coach page route. Client-side does path-based routing. 
router.get('/coach', function (req, res) {
   res.sendFile('public/index.html', options);
})

module.exports = router;