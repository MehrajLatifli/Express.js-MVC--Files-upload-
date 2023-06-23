var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/status', function(req, res, next) {
  res.send('User status');
});


module.exports = router;
