# Contact list

Tutorial app

### how to init a express app
```
npm init //create a package.json

npm install express --save //install express package, and save the dependency

touch app.js  //and write code

node app.js  //to start the server

```
OR directly create a express app
```
express contactlistapp
cd contactlistapp
npm install
set DEBUG=myapp:* & npm start  //windows command to start the server
```

Start mongo db
```
mongod //to start mongo service
mongo  //mongo db command
  show dbs //show all the databases
  use contactlist  //switch to contactlist db
  db.contactlist.insert({name: 'Tom', email: 'tom@testemail.com', number: '(444)333-4444'}) //insert a record
  db.contactlist.find().pretty()
  db.contactlist.insert([{name: , email: , number: }, {...}, {...}])
```  

Connection nodejs app with mongodb
```
npm install mongodb --save
```