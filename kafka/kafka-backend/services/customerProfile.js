const Customers = require('../Models/Customer');
function handle_request(msg, callback){
    var res={};
    var idCustomers = msg.idCustomers;
    console.log(idCustomers);
  
    Customers.findById(idCustomers, (error, profile) => {
      if (error) {
        console.log(error);
        res.status = 205;
        res.message = 'customer not found';
        callback(null, res);
      }
      if (profile) {
        res.status = 200;
        res.data=profile;
        callback(null, res);
        console.log("get customer profile successful!", profile);
      }
    });


};

exports.handle_request = handle_request;