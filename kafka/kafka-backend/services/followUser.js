const Customers = require('../Models/Customer');
function handle_request(msg, callback){
    var res={};
    Customers.findById(msg.idCustomers, async function (err, result) {
        if (err) {
            console.log(error);
            res.status = 205;
            res.message = 'unable to follow error 1';
            callback(null, res);
        }
        if (result) {
          var a = result.following;
          if (a !== undefined && a.includes(msg.idToFollow)) {
            console.log(error);
            res.status = 205;
            res.message = 'Already Exists error 2';
            callback(null, res);
          }
          else {
            Customers.findByIdAndUpdate(msg.idCustomers, { $push: { following: msg.idToFollow } }, { useFindAndModify: false }, (error, profile) => {
              if (error) {
                console.log(error);
                res.status = 205;
                res.message = 'unable to follow error 3';
                callback(null, res);
              }
              if (profile) {
                console.log("following");
                res.status = 200;
                res.message='following';
                callback(null, res);
              }
    
            });
    
          }
        }
      });
};

exports.handle_request = handle_request;