var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydatabase'

mongoClient.connect(url, (err, db) => {
  if(err) return;
  var collection = db.db().collection('food');
  collection.insert({
    name: 'taco',
    tasty: true
  }, (err, result) => {
    collection.find({name:'taco'}).toArray((err, docs) => {
      db.close();
    })
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
