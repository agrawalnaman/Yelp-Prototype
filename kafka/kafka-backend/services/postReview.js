const Restaurants = require('../Models/Restaurant');

function handle_request(msg, callback){
    var res={};
    var d = new Date();
    var newReview={
      customerID: msg.customerID,
      ratings: msg.ratings,
      comments: msg.comments,
      time:d.getTime(),
    };
    Restaurants.findByIdAndUpdate(msg.restaurantID, { $push:{reviews: newReview} }, { useFindAndModify: false }, (error, review) => {
      if (error) {
        res.status = 205;
        res.message = 'review not posted';
        callback(null, res);
      }
      if (review) {
        res.status = 200;
        res.message = 'Review Posted';
        callback(null, res);
      }
    });
};

exports.handle_request = handle_request;