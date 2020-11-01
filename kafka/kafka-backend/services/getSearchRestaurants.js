const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};

    switch (msg.category) {
        case "location":
          Restaurants.find({Location:msg.searchterm}, async function (err, result) {
            if (err) {
                res.status = 205;
            res.message = 'Unable to get on location';
            callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search restaurants success';
                res.data = result;
                callback(null, res);
              console.log("search restaurants successfull");
            }
          });
    
          break;
        case "cuisine":
          Restaurants.find({Cuisine:msg.searchterm}, async function (err, result) {
            if (err) {
                res.status = 205;
                res.message = 'Unable to get on Cuisine';
                callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search restaurants success on cuisine';
                res.data = result;
                callback(null, res);
              console.log("search restaurants successfull");
            }
          });
          break;
        case "dishes":
          Restaurants.find({dishes :  {$elemMatch: {Name: msg.searchterm}}}, async function (err, result) {
            if (err) {
                res.status = 205;
                res.message = 'Unable to get on dishes';
                callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search restaurants success on dishes';
                res.data = result;
                callback(null, res);
              console.log("search restaurants successfull",result);
            }
          });
          break;
        case "deliveryMode":
          Restaurants.find({deliveryMode:msg.searchterm}, async function (err, result) {
            if (err) {
                res.status = 205;
                res.message = 'Unable to get on deliveryMode';
                callback(null, res);
            }
            else {
                res.status = 200;
                res.message = ' search restaurants success on deliveryMode';
                res.data = result;
                callback(null, res);
              console.log("search restaurants successfull");
            }
          });
    
          break;
      }
    
    

};

exports.handle_request = handle_request;