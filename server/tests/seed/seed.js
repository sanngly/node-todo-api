const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const todos = [{
    _id: new ObjectID(),
    text: 'Call Police 100',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Switch off the power and lights',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Text message to friends and neighbours',
    _creator: userTwoId
}, {
    _id: new ObjectID(),
    text: 'Try to find some suitable exit from the house',
    completed: false,
    completedAt: 1594,
    _creator: userThreeId
}
];

const users = [
    {
        _id: userOneId,
        email: 'esanjoyganguly@gmail.com',
        password: 'Subject@123',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'Qwerty@123').toString()
        }]	
    }, {
            _id: userTwoId,
            email: 'simpi.ganguly@gmail.com',
            password: 'Pass@123',
            tokens: [{
                access: 'auth',
                token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, 'Qwerty@123').toString()
            }]	
    }, {
            _id: userThreeId,
            email: 'heroku.dsanjoy@gmail.com',
            password: 'Wqerty@123',
            tokens: [{
                access: 'auth',
                token:  jwt.sign({_id: userThreeId.toHexString(), access: 'auth'}, 'Qwerty@123').toString()
            }]
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        var userThree = new User(users[2]).save();
        return Promise.all[userOne, userTwo, userThree];
    }).then(() => {
        done();
    });
};

module.exports = {todos, populateTodos, users, populateUsers};