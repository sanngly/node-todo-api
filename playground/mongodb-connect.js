// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

/* var obj = new ObjectID();
console.log(obj); */

/* var user = {
    name: 'Sajit',
    age: 55,
    location: 'Chennai'
};
var {name} =  user;
console.log(name); */

/*MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to conect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    db.collection('Todos').insertOne({
        text: 'Need to attend CISCO interview',
        completed: false
    }, (err, result) => {
        if (err) {
           return console.log('Unable to insert todo!', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    }); */
    /* db.collection('Users').insertOne({
        name: 'Govinda Reddy',
        age: 35,
        location: 'Hyderabad'
    }, (err, result) => {
        if (err){
            return console.log('Unable to insert new user.');
        }
        // console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
        console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
    });
    db.close(); */
});
