const Customers = require('../Models/Customer');
function handle_request(msg, callback){
    var res={};

    var updatedValues = {
        FirstName: msg.firstname,
        LastName: msg.lastname,
        Email: msg.email,
        Phone: msg.phone,
        Favourites: msg.favourites,
        DOB: msg.dob,
        City: msg.city,
        State: msg.state,
        Country: msg.country,
        NickName: msg.nickname,
        About: msg.about
      };
    
      Customers.findByIdAndUpdate(msg.idCustomers, { $set: updatedValues }, { useFindAndModify: false }, (error, profile) => {
        if (error) {
            console.log(error);
            res.status = 205;
            res.message = 'customer profile not updated';
            callback(null, res);
        }
        if (profile) {
            res.status = 200;
            res.message = 'customer profile updated';
            callback(null, res);
      }
    });

};

exports.handle_request = handle_request;