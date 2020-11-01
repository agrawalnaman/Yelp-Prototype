const Customers = require('../Models/Customer');
function handle_request(msg, callback){
    var res={};
    Customers.findById(msg.idCustomers , async function (err, result) {
        if (err) {
            res.status = 205;
            res.message = 'Unable to get following';
            callback(null, res);
        }
        else {
            res.status = 200;
            res.message = ' get following success';
            res.data = result;
            callback(null, res);
          console.log("********************", result);
        }
      }).populate('following');
    

};

exports.handle_request = handle_request;