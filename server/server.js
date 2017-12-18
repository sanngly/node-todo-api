const express = require('express');
var bodyParser = require('body-parser');
const port = process.env.port || 3000;

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    //console.log(res.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        //console.log('Unable to add Todo.', err);
        res.status(400).send(err);
    });
});

app.listen(port, ()=> {
    console.log(`Todo Server started on port ${port}`);
});

/* var newTodo = new Todo({
    text: ''
});

newTodo.save().then((doc) => {
    console.log('Save todo', doc);
}, (err) => {
    console.log('Unable to add Todo.', err);
});

var otherTodo = new Todo({
    text: ' Wash the Plates '
});
otherTodo.save().then((doc) => {
    console.log('Save other todo', JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save the other Todo', err);
});
 */

/*  var newUser = new User({
     email: ' esanjoyganguly@gmail.com   '
 });

 newUser.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
 }, (err) => {
     console.log('Unable to save User', err);
  })
 */
