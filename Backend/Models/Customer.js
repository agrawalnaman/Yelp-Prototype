const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var customerProfile = new Schema({
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Phone: {type: String},
    About: {type: String},
    Favourites: {type: String},
    DOB: {type: String},
    City: {type: String},
    State: {type: String},
    Country: {type: String},
    NickName: {type: String},
    ProfilePicPath: {type: String}
},
{
    versionKey: false
});

const customers = mongoose.model('customers', customerProfile);
module.exports = customers;