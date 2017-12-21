const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

var password = 'Qwety@1234';

var text = "I am sanjoy ganguly";
var hash = SHA256(text).toString();

/* bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) =>{
        console.log('Hashed Value ', hash);
    })
}); */
var hashedValue = '$2a$10$ZI5pHz31NLQ2PssCJD42U.zFxaYlmEGBk42UGF4/S6NNIU16D.o7K';
bcrypt.compare(password, hashedValue, (err, result)=>{
    console.log(result);
});

console.log(`Mesasge: ${text}`);
console.log(`Hash: ${hash}`);
console.log(SHA256('Qwerty@1234').toString());