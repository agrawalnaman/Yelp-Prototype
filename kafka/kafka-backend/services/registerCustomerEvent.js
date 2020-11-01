const Events = require('../Models/Event');
function handle_request(msg, callback){
    var res={};
    Events.findById(msg.idEvents, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.status = 205;
          res.message = 'Error 1 registering in Event ';
          callback(null, res);
        }
        if (result) {
          var a = result.customerevent;
          if (a !== undefined && a.includes(msg.idCustomers)) {
            console.log('Mongo Error:', err);
          res.status = 205;
          res.message = 'Error 2 Already Exists ';
          callback(null, res);
          }
          else {
            Events.findByIdAndUpdate(msg.idEvents, { $push: { customerevent: msg.idCustomers } }, { useFindAndModify: false }, (error, profile) => {
              if (error) {
                console.log('Mongo Error:', err);
                res.status = 205;
                res.message = 'Error 3 registering in Event ';
                callback(null, res);
              }
              if (profile) {
                res.status = 200;
                res.message = 'Registered Successfully';
                callback(null, res);
              }
    
            });
    
          }
        }
      });
    

};

exports.handle_request = handle_request;