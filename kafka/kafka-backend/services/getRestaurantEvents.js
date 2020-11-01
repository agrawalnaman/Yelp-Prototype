
const Events = require('../Models/Event');

function handle_request(msg, callback){
    var res={};

    var idRestaurants = msg.idRestaurants;
    console.log(idRestaurants);
    Events.find({ restaurantevent: idRestaurants }, async function (err, result) {
      if (err) {
        res.status = 205;
        res.message = 'Unable to Fetch all Events';
        callback(null, res);
      }
      else {
        res.status = 200;
        res.message = ' Fetch Events success';
        res.data = result;
        callback(null, res);
        console.log("Get Events Successful");
      }
    });

};
exports.handle_request = handle_request;