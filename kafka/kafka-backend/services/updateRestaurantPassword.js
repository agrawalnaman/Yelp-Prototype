const Restaurants = require('../Models/Restaurant');
const bcrypt = require('bcryptjs');
function handle_request(msg, callback){
    var res={};

    async function hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log("hash:", hash);
        return hash;
      }
      hashPassword(msg.password).then((newPassword) => {
    
        Restaurants.findByIdAndUpdate(msg.idRestaurants, { Password: newPassword }, { useFindAndModify: false }, (error, profile) => {
          if (error) {
            res.status = 205;
            res.message = 'Restaurant password not updated';
            callback(null, res);
          }
          if (profile) {
            res.status = 200;
            res.message = 'Restaurant password updated';
            callback(null, res);
          }
        });
      });


};

exports.handle_request = handle_request;