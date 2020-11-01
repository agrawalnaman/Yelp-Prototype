const Restaurants = require('../Models/Restaurant');
const Events = require('../Models/Event');
function handle_request(msg, callback){
    var res={};
    var eventDetails = new Events({

        EventName: msg.name,
        Description: msg.description,
        Time: msg.time,
        Date: msg.date,
        Location: msg.location,
        Hashtags: msg.hashtags,
        restaurantevent: msg.idRestaurants,
      });
      eventDetails.save((error, data) => {
        if (error) {
            res.status = 205;
            res.message = 'Event Not Added';
            callback(null, res);
        }
        else {
            res.status = 200;
            res.message = 'Event Added';
            callback(null, res);
          console.log("New Event Added");
        }
      });


};

exports.handle_request = handle_request;