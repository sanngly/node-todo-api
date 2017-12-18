const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to conect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    // delete Many
    /* db.collection('Todos').deleteMany({"text" : "Drink Water"}).then((result) => {
        console.log(result)
    }); */

    // deleteOne

    /* db.collection('Todos').deleteOne({"text" : "Drink Water"}).then((result) => {
        console.log(result)
    }); */

    //findAndDelete

    /* db.collection('Todos').findOneAndDelete({"completed" : false}).then((result) => {
        console.log(result);
    }); */

    /* db.collection('Users').deleteMany({"name" : "Govinda Reddy"}).then((result) => {
        console.log(result);
    }); */

    /* db.collection('Users').deleteOne({_id: new ObjectID("5a3767cace5b7021783a55be")}).then((result) => {
        console.log(result);
    }); */

    db.collection('Users').findOneAndDelete({"age" : 35}).then((result) => {
        console.log(result);
    }); 

    // "_id" : ObjectId("5a3767cace5b7021783a55be"),

    db.close();
});
