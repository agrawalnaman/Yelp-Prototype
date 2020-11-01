const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};
    var idCustomers = msg.idCustomers;
    console.log(idCustomers);
    Restaurants.find({ "orders.idCustomers": msg.idCustomers }, async function (err, result) {
      if (err) {
        console.log('Mongo Error:', err);
        res.status = 205;
        res.message = 'Unable to get customer orders';
        callback(null, res);
      }
      else {
        res.status = 200;
        res.message = ' get customer orders success';
        res.data = result;
        callback(null, res);
        console.log("********************", result);
      }
    })

};

exports.handle_request = handle_request;