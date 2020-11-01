
const Events = require('../Models/Event');

function handle_request(msg, callback){
    var res={};

    Events.find({}).
    populate('restaurantevent', 'Name').
    exec(function (err, eventInfo) {
      if (err) return handleError(err);
      console.log('The Event is:', JSON.stringify(eventInfo));
      res.status = 200;
      res.message = ' Fetch upcoming Events success';
      res.data = eventInfo;
      callback(null, res);
    });

};
exports.handle_request = handle_request;