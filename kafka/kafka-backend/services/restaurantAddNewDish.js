const Restaurants = require('../Models/Restaurant');
function handle_request(msg, callback){
    var res={};
    var newDishDetails = {
    
        Name: msg.dishName,
        Price: msg.price,
        Category: msg.category,
        Image: msg.imageURL,
        Ingredients: msg.ingredients
      };
    Restaurants.findByIdAndUpdate(msg.idRestaurants, { $push:{dishes: newDishDetails} }, { useFindAndModify: false }, (error, dish) => {
      if (error) {
        res.status = 205;
        res.message = 'Dish Not Added';
        callback(null, res);
      }
      if (dish) {
        res.status = 200;
        res.message="Dish Added";
        callback(null, res);
        console.log("Dish Added");
      }
    });


};

exports.handle_request = handle_request;