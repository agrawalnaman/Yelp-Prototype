const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};
   console.log("message$$$$$:", msg);
    Restaurants.findById( msg.idRestaurants , async function (err, result) {
        if (err) {
          console.log(error);
            res.status = 205;
            res.message = 'Unable to Fetch orders';
            callback(null, res);
        }
        else {
            res.status = 200;
            res.message = ' Fetch orders success';
            res.data = result;
            console.log(res.data);
            callback(null, res);
          console.log("Get Orders Successful");
        }
      });

};
exports.handle_request = handle_request;