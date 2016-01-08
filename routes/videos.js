var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/downloadtracks';
var ObjectID = require('mongodb').ObjectID;
var merge = require('merge');

router.post('/insert', function(req, res, next) {
	var newRecord
	if(req.query.data){
		newRecord = JSON.parse(req.query.data)
	} else {
		res.status(500).send({error: "No data receieved!"})
	}
	try{
		MongoClient.connect(url, function(err, db) {
			db.collection('records').insertOne(newRecord, function(err, doc){
				if(err) {
					throw err
				}
				res.status(200).json({"id":doc["ops"][0]["_id"]})
			})
		})
	}catch(e){
		res.status(500).send({error: e.message})
	}
});

router.put('/update/:action/:state/:id', function(req, res, next) {
	if(!req.params.action || !req.params.state || !req.params.id) {
		res.status(500).send({error: "You should tell me what's your action, state and record's id you wanna update"})
	}
	var updateData = {}
	if(req.query.data) {
		updateData = JSON.parse(req.query.data)
	}
    //add a column download_end_time OR upload_start_time OR upload_end_time 
    var timeFlagKey = req.params.action + "_" + req.params.state + "_time"
    updateData[timeFlagKey] = new Date()

    try{
    	MongoClient.connect(url, function(err, db) {
    		db.collection('records').updateOne(
    			{"_id":new ObjectID(req.params.id)},
    			{
    				$set: updateData
    			}, 
    			function(err, doc){
    				if(err) throw err
    					res.status(200).send()
    			}
    			)
    	})
    }catch(e){
    	res.status(500).send({error: e.message})
    }
});

router.get('/', function(req, res,next){
	var results = []
	try{
		MongoClient.connect(url, function(err, db) {
			var cursor = db.collection('records').find()
			cursor.each(function(err, doc){
				if(err) throw err
					if (doc){
						results.push(doc)
					}else{
						res.status(200).json(results)
					}
				})
			})
		}catch(e){
			res.status(500).send({error: e.message})
		}
});

router.get('/:id', function(req, res,next){
	try{
		MongoClient.connect(url, function(err, db) {
			db.collection('records').findOne({"_id":new ObjectID(req.params.id)}, function(err, doc){
				if(err) throw err
					if (doc){
						res.status(200).json(doc)
					}
			})
		})
		}catch(e){
			res.status(500).send({error: e.message})
		}
});

module.exports = router;