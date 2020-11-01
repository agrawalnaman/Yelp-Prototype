const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};
    var newDishDetails = {
        Name: msg.dishName,
        Price: msg.price,
        Category: msg.category,
        Image: msg.imageURL,
        Ingredients: msg.ingredients,
      };
      //console.log("dishes:",newDishDetails);
      var set={};
      for (var field in newDishDetails) {
        set['dishes.$.' + field] = newDishDetails[field];
      }
      Restaurants.update({_id:msg.idRestaurants,"dishes._id":msg.idDishes}, { $set: set }, { useFindAndModify:false  }, (error, dish) => {
        if (error) {
            res.status = 205;
            res.message = 'Dish Not Edited';
            callback(null, res);
          console.log(error);

        }
        if (dish) {
            res.status = 200;
            res.message="Dish Edited";
            callback(null, res);
            console.log("Dish Edited");
        }
    
      });

};

exports.handle_request = handle_request;