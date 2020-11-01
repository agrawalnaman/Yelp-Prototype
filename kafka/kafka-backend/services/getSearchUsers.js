const Customers = require('../Models/Customer');
function handle_request(msg, callback){
    var res={};
    switch (msg.category) {
        case "Location":
          Customers.find({City:msg.searchterm}, async function (err, result) {
            if (err) {
                res.status = 205;
                res.message = 'Unable to get on location';
                callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search users success';
                res.data = result;
                callback(null, res);
              console.log("search users on location successfull");
            }
          });
    
          break;
        case "FirstName":
          Customers.find({FirstName:msg.searchterm}, async function (err, result) {
            if (err) {
                res.status = 205;
                res.message = 'Unable to get on FirstName';
                callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search users success';
                res.data = result;
                callback(null, res);
              console.log("search users successfull");
            }
          });
          break;
        case "NickName":
          Customers.find({NickName:msg.searchterm}, async function (err, result) {
            if (err) {
              console.log('Mongo Error:', err);
              res.status = 205;
              res.message = 'Unable to get on NickName';
              callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search users success';
                res.data = result;
                callback(null, res);
              console.log("search on nickname successfull",result);
            }
          });
          break;
      }
    


};

exports.handle_request = handle_request;