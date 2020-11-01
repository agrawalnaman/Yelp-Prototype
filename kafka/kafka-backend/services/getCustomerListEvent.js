
const Events = require('../Models/Event');
const Customers = require('../Models/Customer');

function handle_request(msg, callback){
    var res={};

    Events.findById(msg.idEvents, async function (err, result) {
        if (err) {
            res.status = 205;
            res.message = 'Unable to Fetch customer list Events';
            callback(null, res);
        }
        else {
            res.status = 200;
            res.message = ' Fetch customer Events list success';
            res.data = result;
            callback(null, res);
          console.log("********************", result);
        }
      }).populate('customerevent');
};
exports.handle_request = handle_request;