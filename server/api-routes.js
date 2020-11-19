'use strict';

var express = require('express');
var router = express.Router();

// API to get data for the home page 
router.get('/api/home', function (req, res) {
   if (req.user && req.user.externalId)
      res.send('api');
   else
      res.send('fail');
})

module.exports = router;