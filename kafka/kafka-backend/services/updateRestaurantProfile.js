const Restaurants = require('../Models/Restaurant');

function handle_request(msg, callback){
    var res={};

    var updatedValues = {
        Name: msg.name,
        Email: msg.email,
        Password: msg.password,
        Contact: msg.contact,
        Location: msg.location,
        Description: msg.description,
        Timings: msg.timings,
        deliveryMode: msg.deliveryMode
      }
    
      Restaurants.findByIdAndUpdate(msg.idRestaurants, { $set: updatedValues }, { useFindAndModify: false }, (error, profile) => {
        if (error) {
            res.status = 205;
            res.message = 'Restaurant Profile not updated';
            callback(null, res);
        }
        if (profile) {
            res.status = 200;
            res.message = 'Restaurant Profile updated';
            callback(null, res);
        }
    
      });

};

exports.handle_request = handle_request;