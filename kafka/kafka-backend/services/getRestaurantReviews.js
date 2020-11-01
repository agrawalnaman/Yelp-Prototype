const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};

    var idRestaurants = msg.idRestaurants;
    console.log("reviews for restaurant :", idRestaurants);
    Restaurants.findById(idRestaurants, async function (err, result) {
      if (err) {
        console.log('Mongo Error:', err);
        res.status = 205;
        res.message = 'Unable to get reviews restaurant';
        callback(null, res);
      }
      else {
        res.status = 200;
        res.message = ' get reviews success';
        res.data = result;
        callback(null, res);
        console.log("********************", result);
      }
    })

};

exports.handle_request = handle_request;