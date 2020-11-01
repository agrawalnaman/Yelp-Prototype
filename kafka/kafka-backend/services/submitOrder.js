const Restaurants = require('../Models/Restaurant');

function handle_request(msg, callback){
    var res={};
    var d = new Date();
    var newOrder={
      deliveryMode:msg.deliverymode,
      orderStatus:"orderrecieved",
      time:d.getTime(),
      items:msg.finalorder,
      idCustomers:msg.idCustomers
    };
  
    Restaurants.findByIdAndUpdate(msg.idRestaurants, { $push:{orders: newOrder} }, { useFindAndModify: false }, (error, order) => {
      if (error) {
        res.status = 205;
        res.message = 'Order Not Placed';
        callback(null, res);
      }
      if (order) {
        res.status = 200;
        res.message = 'Order Placed';
        callback(null, res);
      }
    });

};
exports.handle_request = handle_request;