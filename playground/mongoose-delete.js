const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/* Todo.remove({}).then((result) => {
    console.log(result);
}); */

Todo.findOneAndRemove({_id: '5a38fee226ec235775a909ed'}).then((todo) => {
    console.log(todo);
});
// ObjectId("5a38fddf26ec235775a909eb"),

Todo.findByIdAndRemove('5a38fede26ec235775a909ec').then((todo) => {
    console.log(todo);
});