const Customers = require('../Models/Customer');

function handle_request(msg, callback){
    var res={};

    Customers.find({}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.status = 205;
          res.message = 'Unable to get all users';
          callback(null, res);
        }
        else {
            res.status = 200;
            res.message = ' get all users success';
            res.data = result;
            callback(null, res);
          console.log("********************", result);
        }
      })
};
exports.handle_request = handle_request;