const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a todo', (done) => {
        var text = 'Create this mocha test suite.';
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                console.log(e);
                done(e);    
            });
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(4);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos from mongo db', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);            
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find({
                _creator: users[0]._id
            }).then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    })
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[2]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        /* .expect((res) => {
            expect(res.body.todo.text).toBe(todos[2].text);
        }) */
        .end(done);
    });

    it('should return 404 if todo is not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if non-object id return', (done) => {
        request(app)
        .get(`/todos/10641895`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should return todo deleted', (done) => {
        var hexId = todos[2]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
              return done(err);  
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist;
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });

    it('should not delete todo created by other user', (done) => {
        var hexId = todos[2]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        /* .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        }) */
        .end((err, res) => {
            if(err) {
              return done(err);  
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist;
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`/todos/10641895`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done)=> {
        var hexId = todos[0]._id.toHexString();
        var text = 'This shoudld be a new text from mocha test suite';
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true,
            text: text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            //expect(res.body.todo.completedAt).toBeA('number');
            //expect(2).toBeA('number');
        })
        .end(done);
    });

    it('should not update the todo created by other user', (done)=> {
        var hexId = todos[2]._id.toHexString();
        var text = 'This shoudld be a new text from mocha test suite';
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true,
            text: text
        })
        .expect(404)
        /* .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            //expect(res.body.todo.completedAt).toBeA('number');
            //expect(2).toBeA('number');
        }) */
        .end(done);
    });

    it('should clear competedAt when to do is not completed', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This shoudld be a new text from mocha test suite make';
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: false,
            text: text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist;
            //expect(2).toBeA('number');
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    //this.timeout(15000);
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token + 'Z')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        })
        .end(done);
    });

    it('should create user', (done) => {
        //setTimeout(done, 15000);
        var email = 'sukdeb.g@gmail.com';
        var password = 'password!';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toExist;
            expect(res.body._id).toExist;
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toExist;
                expect(user.password).toNotEqual(password);
                done();
            }).catch((e) => {
                done(e);
            });
        }); 
    });

    it('should return validation errors if request is invalid', (done) => {
        request(app)
        .post('/users')
        .send({
            'email': 'sa',
            'password': 'ds'    
        })
        .expect(400)
        .end(done);  
    });

    it('should not create user if email is already in use', (done) => {
        request(app)
        .post('/users')
        .send({
            'email': 'esanjoyganguly@gmail.com',
            'password': 'Qwerty@1234'    
        })
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login with valid user and return valid token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            "email": users[1].email,
            "password": users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toExist;
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id)
            .then((user) => {
                //expect(user).toExist();
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            })
            .catch((e) => {
                done();
            });
        });
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            "email": users[1].email,
            "password": users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
            expect(res.header['x-auth']).toNotExist;
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id)
            .then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            })
            .catch((e) => {
                done();
            });
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('should delete valid token on logout of user', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => {
                done(e);
            }) ;
        });
    });

    it('should get unauthorized error with some invalid token', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token + '1')
        .expect(401)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => {
                done(e);
            }) ;
        });
    });
});


