const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};

    var idRestaurants = msg.idRestaurants;
  Restaurants.findById(idRestaurants, (error, profile) => {
    if (error) {
        res.status = 205;
        res.message = 'restaurant not found';
        callback(null, res);
    }
    if (profile) {
        res.status = 200;
        res.data=profile;
        callback(null, res);
      console.log("get restaurant profile successful!");
    }
  });



};

exports.handle_request = handle_request;