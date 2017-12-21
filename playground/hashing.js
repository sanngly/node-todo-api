const {SHA256} = require('crypto-js');

var text = "I am sanjoy ganguly";
var hash = SHA256(text).toString();

console.log(`Mesasge: ${text}`);
console.log(`Hash: ${hash}`);
console.log(SHA256('Qwerty@1234').toString());