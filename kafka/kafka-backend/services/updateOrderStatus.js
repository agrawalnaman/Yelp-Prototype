const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};

    Restaurants.updateOne({_id:msg.idRestaurants,"orders._id":msg.idOrders}, { $set:{"orders.$.orderStatus":msg.orderstatus} }, { useFindAndModify:false  }, (error, order) => {
        if (error) {
            console.log('Mongo Error:', err);
            res.status = 205;
            res.message = 'Unable to update order status';
            callback(null, res);
        }
        if (order) {
            res.status = 200;
            res.message = 'Status updated';
            callback(null, res);
          console.log("Status Updated");
        }
    
      });
};

exports.handle_request = handle_request;