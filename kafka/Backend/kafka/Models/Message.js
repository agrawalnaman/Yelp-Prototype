const mongoose = require('mongoose');
const restaurants = require('./Restaurant');
const customers = require('./Customer');
const Schema = mongoose.Schema;

var messageDetails = new Schema({
    
    messages:{type: String}
},
{
    versionKey: false
});

const messages = mongoose.model('messages', messageDetails);
module.exports = messages;
