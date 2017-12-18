const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/* var id = '6a37b73bc95de5216cd6667b';

if (!ObjectID.isValid(id)) {
    console.log('Id is not valid.');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('Invalid Id.');
    }
    console.log('Todo By Id ', todo);
}).catch((err) => {
    console.log(err);
});
 */

 // user findById

 User.findById('5a3790e54728fa1ff87edd37').then((user) => {
     if (!user) {
         return console.log('Unable to find the user.');
     }
     console.log(JSON.stringify(user, undefined, 2));
 }).catch((e) => {
    console.log(e);
 });

//d" : ObjectId("5a3790e54728fa1ff87edd37"),
//ail" : "esanjoyganguly@gmail.com",