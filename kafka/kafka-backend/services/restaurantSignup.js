const Restaurants = require('../Models/Restaurant');
const bcrypt = require('bcryptjs');

async function handle_request(msg, callback){
    var res={};
    var email = msg.email;
  var Name = msg.restaurantname;
  var location = msg.location;
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }
  var restaurantPassword = await hashPassword(msg.password);
  var RestaurantProfile = new Restaurants({
    Name: Name,
    Location: location,
    Email: email,
    Password: restaurantPassword
  });
  Restaurants.findOne({ Email: email }, (error, profile) => {
    if (error) {
        res.status = 205;
        res.message = 'mongo error';
        callback(null, res);
    }
    if (profile) {
        res.status = 205;
        res.message = 'Restaurant Email ID already exists';
        callback(null, res);
    }
    else {
      RestaurantProfile.save((error, data) => {
        if (error) {
            res.status = 205;
            res.message = 'unable to save';
            callback(null, res);
        }
        else {
            res.status = 200;
            res.message = 'Restaurant Profile Created';
            callback(null, res);
        }
      });
    }
  });
};

exports.handle_request = handle_request;

