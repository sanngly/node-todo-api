const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to conect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5a375f56b5fe1a1dcceba76b')
    }, { 
        $set : {
            completed : true
        }
    }, {
        returnOriginal : false
    }).then((result) => {
        console.log(result);
    });
    
    // "_id" : ObjectId("5a37620de3851f0f0415d77a")
    // ObjectId("5a375f56b5fe1a1dcceba76b"),

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a33690cc1fd0f047c4d8913')
    }, {
        $set : {
            name: 'Sukdeb Ganguly'
        }, 
        $inc:  {
            age : 1 
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    db.close();
});
