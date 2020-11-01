
const Events = require('../Models/Event');

function handle_request(msg, callback){
    var res={};

    Events.find({ customerevent: msg.idCustomers }, async function (err, result) {
        if (err) {
            res.status = 205;
            res.message = 'Unable to Fetch Registered Events';
            callback(null, res);
        }
        else {
            res.status = 200;
            res.message = ' Fetch Registered Events success';
            res.data = result;
            callback(null, res);
          console.log("********************", result);
        }
      }).populate('restaurantevent', 'Name');
    
};
exports.handle_request = handle_request;