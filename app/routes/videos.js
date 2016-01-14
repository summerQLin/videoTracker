var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://db:27017/downloadtracks';
var ObjectID = require('mongodb').ObjectID;
var merge = require('merge');

router.post('/insert', function(req, res, next) {
	
	var newRecord ={}
	if(req.body){
		newRecord = req.body
	} else {
		res.status(500).send({error: "No data receieved!"})
	}
	//insert {'download_start': new Date()}
	merge(newRecord, {"download_start_time":new Date()})
	try{
		MongoClient.connect(url, function(err, db) {
            if (err) throw err
			db.collection('records').insertOne(newRecord, function(err, doc){
				db.close()
				if(err) throw err
				if (doc){
					res.status(200).json({"id":doc["ops"][0]["_id"]})
				}
			})
		})
	}catch(e){
		res.status(500).send({error: e.message})
	}
});

router.put('/update/:action/:state/:id', function(req, res, next) {
	//:action   download/upload
	//:state  end/start
	if(!req.params.action || !req.params.state || !req.params.id) {
		res.status(500).send({error: "You should tell me what's your action, state and record's id you wanna update"})
	}
	var updateData = {}
	if(req.body) {
		updateData = req.body
	}
    //add a column download_end_time OR upload_start_time OR upload_end_time 
    var timeFlagKey = req.params.action + "_" + req.params.state + "_time"
    updateData[timeFlagKey] = new Date()

    try{
    	var objID = ObjectID(req.params.id)
    	MongoClient.connect(url, function(err, db) {
    		if (err) throw err
    		db.collection('records').updateOne(
    			{"_id":objID},
    			{
    				$set: updateData
    			}, 
    			function(err, doc){
    				db.close()
    				if(err) throw err
    				if(doc){
    					res.status(200).send()		
    				}
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
			if (err) throw err
			var cursor = db.collection('records').find()
			cursor.each(function(err, doc){
				db.close()
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

router.delete('/:id', function(req, res, next){
	try{
		var objID = ObjectID(req.params.id)
		MongoClient.connect(url, function(err, db){
			db.collection('records').deleteOne({"_id":objID}, function(err, doc){
				db.close()
				if(err) throw err
			    if (doc) {
					res.status(200).json(doc)
				}
			})
		})
	}catch(e){
		res.status(500).send({error: e.message})
	}
});

router.delete('/', function(req, res, next){
	try{
		MongoClient.connect(url, function(err, db){
			db.collection('records').deleteMany({}, function(err, doc){
				db.close()
				if(err) throw err
			    if (doc) {
					res.status(200).json(doc)
				}
			})
		})
	}catch(e){
		res.status(500).send({error: e.message})
	}
});

router.get('/:id', function(req, res,next){
	try{
		var objID = ObjectID(req.params.id)
		MongoClient.connect(url, function(err, db) {
			if(err) throw err
			db.collection('records').findOne({"_id":objID}, function(err, doc){
				db.close()
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
