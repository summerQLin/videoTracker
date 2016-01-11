var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var merge = require('merge');
//authz
// ?account=qing.lin@hpe.com   repository=null  get all repos accessable to user   ----[{'repository':'qinglin/busybox','access_level':'admin'},{}]
// ?account=qing.lin@hpe.com repository=qinglin/busybox(public)  ----admin
// ?account=qingaccount repository=qinglin/busybox  ----read-only
// ?account=qing.lin@hpe.com repository=summerlin/busybox  ----- read-only
// ?account=qingaccount repository=summerlin/busybox  ----admin
// ?new account to add one or return unknown user
// anoymous
// other namespace should be admin
// user is not in database

// /authz/apply   apply a repository for personal user
//  ?namespace=qingaccount  name=busybox ... refer DTR API doc...user must exist, and namespace=account, otherwise deny

// /authz/sync
//  1. check user's dn 
//  2. sync ldap group repository_team_access

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/myproject';

router.get('/', function(req, res, next) {
	var account = req.query.account;
  console.log('requesting account: ' + account);
  var repository = req.query.repository;
  var namespace = null;
  var name = null;
  if (repository) {
    repo_array = repository.split('/')
    namespace = repo_array[0]
    name = repo_array[1]
    console.log('requesting repository: ' + repo);
  }

  MongoClient.connect(url, function(err, db) {
    if (err) {
      return next(err)
    }
    async.waterfall([
      //get account ID
      function getAccountID(callback) {
        var accountID
        try{
          db.collection('accounts').findOne({'name':account}, function(err, accountObj){
           if(err != null) {
             throw err
           }
           accountID = accountObj['_id']
           callback(null, accountID)
         })
          //throw new Error("somethings broke")
        } catch (e) {
          callback(e, null)
        }

      },
      //get user access repo
      function getUserAccessRepos(accountID, callback) {
        console.log('AccountID is ' + accountID)
        var userAccessRepos = []
        var cursor = db.collection('repository_user_access').find()
        cursor.each(function(err, doc){
         if (doc != null) {
           doc['userAccessList'].forEach(function(userRole, i){
             if (userRole['user_id'].toString().trim() === accountID.toString().trim()) {
              userAccessRepos.push({'repository_id':doc['repository_id'], 'access_level':userRole['access_level']})
         }
       })
         } else {
           console.log('userAccessRepos' + userAccessRepos)
           callback(null,accountID,userAccessRepos)
         }
       })
      }, 
      function getTeamIDs(accountID, userAccessRepos, callback) {
        console.log('2nd: ' + accountID)
        console.log('2nd: '+ JSON.stringify(userAccessRepos))
        var teamIDs = []
        var cursor = db.collection('teams').find()
        cursor.each(function(err, doc){
          if (doc != null) {
            doc['members'].forEach(function(member, i){
              if (member['member_id'].toString().trim() === accountID.toString().trim()) {
                teamIDs.push(doc['_id'])
              }
            })
          }else{
           callback(null,teamIDs, userAccessRepos)
         }
       })
      },
      function getTeamAccessRepos(teamIDs, userAccessRepos, callback) {
        console.log('3rd User Access Repos are '+ JSON.stringify(userAccessRepos))
        console.log('3rd '+ teamIDs)
        var teamAccessRepos=[]
        var cursor = db.collection('repository_team_access').find()
        cursor.each(function(err, doc){
          if(doc != null){
            doc['teamAccessList'].forEach(function(teamRole,i){
              teamIDs.forEach(function(teamID, i){
               if (teamRole['team_id'].toString().trim() === teamID.toString().trim()) {
                teamAccessRepos.push({'repository_id':doc['repository_id'], 'access_level':teamRole['access_level']})
              }
            })
            })
          }else{
            var accessRepos = teamAccessRepos.concat(userAccessRepos)
            callback(null, accessRepos)
          }
        })
      },
      function getRepoDetail(accessRepos, callback){
        console.log('4th '+JSON.stringify(accessRepos))
        var mergedAccessRepos = []
        accessRepos.forEach(function(accessRepo, i){
          db.collection('repositories').findOne({'_id':accessRepo['repository_id']}, function(err, repoObj){
            mergedAccessRepos.push(merge(repoObj,accessRepo))
            if(i === accessRepos.length-1) {
              callback(null, mergedAccessRepos)
            }
          })
        })
      },
      function integratePublicRepos(mergedAccessRepos, callback){
        console.log('5th ' + JSON.stringify(mergedAccessRepos))
        var accessPublicRepos = []
        var cursor = db.collection('repositories').find({'visibility':'public'})
        cursor.each(function(err, doc){
          if(doc!= null){
            var existed = false
            mergedAccessRepos.forEach(function(accessRepo, i){
            if(accessRepo['_id'].toString().trim() === doc['_id'].toString().trim()) {
              existed = true
            }
          })
            if (!existed){
              accessPublicRepos.push(merge(doc, {'access_level':'read-only'}))
            }
          }else{
            callback(null, accessPublicRepos.concat(mergedAccessRepos))
          }
        })
      }
      ], function(err, result){
        console.log('closing...')
        db.close()
        if (err) {
          console.log(err)
          res.status(500).send({error: err.message})
          return
        }
        res.json(result)
      })
})
});


module.exports = router;