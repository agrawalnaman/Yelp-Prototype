
const mongoose = require('mongoose');
const customers = require('./Customer');
const Schema = mongoose.Schema;

const dishDetails = new Schema({
    Name: {type: String, required: true},
    Price: {type: String, required: true},
    Ingredients: {type: String, required: true},
    Image: {type: String},
    Category: {type: String}

},
{
    versionKey: false
});
const reviewDetails = new Schema({
    customerID:  {type: String, required: true},
    ratings: {type: String},
    comments: {type: String},
    time:{type:String}

},
{
    versionKey: false
});

const orderDetails = new Schema({
    deliveryMode:{type: String, required: true},
    orderStatus:{type: String, required: true},
    time:{type:String},
    idCustomers:{type:String},
    items:[{
        Name: {type: String, required: true},
        Price: {type: String, required: true},
        Ingredients: {type: String, required: true},
        Image: {type: String},
        Category: {type: String},
        quantity:{type:String}
    }]
},
{
    versionKey: false
});
var restaurantProfile = new Schema({
    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Location: {type: String},
    Description: {type: String},
    Contact: {type: String},
    Timings: {type: String},
    deliveryMode: {type: String},
    PictureOfRestaurants:{type:String},
    dishes:[dishDetails],
    orders:[orderDetails],
    reviews:[reviewDetails],
    
},
{
    versionKey: false
});

const restaurants = mongoose.model('restaurants', restaurantProfile);
module.exports = restaurants;
