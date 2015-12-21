var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  person1 = {
    name: 'Tim',
    email: 'tim1e@email.com',
    number: '(111)111-1111'
  };

  person2 = {
    name: 'Emily',
    email: 'emily@email.com',
    number: '(222)222-2222'
  };

  var contactlist = [person1, person2];
  res.json(contactlist)
});

module.exports = router;
