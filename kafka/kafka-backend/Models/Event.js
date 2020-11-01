const mongoose = require('mongoose');
const restaurants = require('./Restaurant');
const customers = require('./Customer');
const Schema = mongoose.Schema;

var eventDetails = new Schema({
   
    EventName: {type: String, required: true},
    Description: {type: String},
    Time: {type: String},
    Date: {type: String},
    Location: {type: String},
    Hashtags: {type: String},
    restaurantevent:[{type: Schema.Types.ObjectId, ref: restaurants}],
    customerevent:[{type: Schema.Types.ObjectId, ref: customers}],
},
{
    versionKey: false
});

const events = mongoose.model('events', eventDetails);
module.exports = events;
