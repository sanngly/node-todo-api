require('./config/config');

const express = require('express');
var bodyParser = require('body-parser');
const port = process.env.port || 3000;
const {ObjectID} = require('mongodb');
const _ = require('lodash');

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    // console.log(req.params.id);
    // res.send(req.params);
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send('Invalid id.');
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            console.log('Unable to find the Todo by Id.');
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        console.log('Error occured while getting todo by Id', err);
        res.status(404).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid ${id} to delete`);
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        return res.status(404).send(err);
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid ${id} to update.`);
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    } ).catch((e) => {
        return res.status(404).send(err);
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

 module.exports = {app};
