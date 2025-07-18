const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name: String,
    dob: String,
    email: { type: String, unique: true },
    password: String,
    role:String
});

let usermodel = mongoose.model('usermodel', userschema)
module.exports = usermodel