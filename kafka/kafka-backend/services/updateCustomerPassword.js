const Customers = require('../Models/Customer');
const bcrypt = require('bcrypt');
function handle_request(msg, callback){
    var res={};
    async function hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log("hash:", hash);
        return hash;
      }
      hashPassword(msg.password).then((newPassword) => {
    
    
        Customers.findByIdAndUpdate(msg.idCustomers, { Password: newPassword }, { useFindAndModify: false }, (error, profile) => {
          if (error) {
            console.log(error);
            res.status = 205;
            res.message = 'customer password not updated';
            callback(null, res);
          }
          if (profile) {
            res.status = 200;
            res.message = 'customer password updated';
            callback(null, res);
          }
    
        });
      });

};

exports.handle_request = handle_request;