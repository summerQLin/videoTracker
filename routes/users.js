var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/contactlist';


var findContacts = function(db, callback) {
   var cursor =db.collection('contactlist').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc); 
      } else {
         callback();
      }
   });
};
/* GET users listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  // findContacts(db, function() {
  //     db.close();
  // });

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

  var contact_collection =db.collection('contactlist');
  //insert
  // contact_collection.insert([person1,person2], function(err, result){
  //   if (err) {
  //     console.log(err)
  //   }
  // });
  //find
  contact_collection.find().toArray(function(err,result){
    db.close();
    res.json(result)
  });

 
});


  // var contactlist = [person1, person2];
  // res.json(contactlist)
});

module.exports = router;
