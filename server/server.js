require('./config/config');

const express = require('express');
var bodyParser = require('body-parser');
const port = process.env.port || 3000;
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    //console.log(res.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        //console.log('Unable to add Todo.', err);
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator : req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    // console.log(req.params.id);
    // res.send(req.params);
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send('Invalid id.');
    }
    //Todo.findById(id).then((todo) => {
    Todo.findOne(
        {
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send(`Invalid ${id} to delete`);
    }
    //Todo.findByIdAndRemove(id).then((todo) => {
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        return res.status(404).send(err);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set:body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    } ).catch((e) => {
        return res.status(404).send(err);
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

/* app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        res.send(user);
    }).catch((e) => {
        res.status(400).send();
    });
    //res.send(body);
}); */



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
