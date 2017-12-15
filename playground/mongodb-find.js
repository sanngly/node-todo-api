const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to conect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    db.collection('Todos').find({_id: new ObjectID('5a3367bf70a71322988a0edd')}).toArray().then((doc) => {
        console.log('Todos List.');
        console.log(JSON.stringify(doc, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch record from collection.');
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count is ${count}`);
        // console.log(JSON.stringify(doc, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch record from collection.');
    });

    db.collection('Users').find({location: 'Mumbai'}).toArray().then((docs) => {
        console.log('Users List.');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch record from Users collection.');
    });

    db.close();
});
