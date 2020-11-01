const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};

    var idRestaurants = msg.idRestaurants;
    console.log(idRestaurants);
    Restaurants.findById( idRestaurants , async function (err, result) {
      if (err) {
        res.status = 205;
        res.message = 'Unable to Fetch all dishes';
        callback(null, res);
      }
      else {
        res.status = 200;
        res.message = ' Fetch Dishes success';
        res.data = result;
        callback(null, res);
      console.log("Get Dishes Successful");
      }
    });

};
exports.handle_request = handle_request;