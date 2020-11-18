'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();

var options = {
   root: path.join(__dirname, "..")
};

// Home page route. Client-side does path-based routing. 
router.get('/login', function (req, res) {
   res.sendFile('public/index.html', options);
})

// Member page route. Client-side does path-based routing. 
router.get('/member', function (req, res) {
   if (!req.user)
      res.sendFile('public/internalerror.html', options);
   else
      res.sendFile('public/index.html', options);
})

// Coach page route. Client-side does path-based routing. 
router.get('/coach', function (req, res) {
   if (!req.user)
      res.sendFile('public/internalerror.html', options);
   else
      res.sendFile('public/index.html', options);
})

module.exports = router;