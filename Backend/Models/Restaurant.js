const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var restaurantProfile = new Schema({
    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Location: {type: String},
    Description: {type: String},
    Contact: {type: String},
    Timings: {type: String},
    Cuisine: {type: String},
    deliveryMode: {type: String},
    PictureOfRestaurants:{type:String}
},
{
    versionKey: false
});

const restaurants = mongoose.model('restaurants', restaurantProfile);
module.exports = restaurants;
