
//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");
const bcrypt = require('bcryptjs');
const { response } = require("express");
module.exports = app;
//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

const { mongoDB } = require('./config');
const mongoose = require('mongoose');
const Customers = require('./Models/Customer');
const Restaurants = require('./Models/Restaurant');

const Events = require("./Models/Event");
var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected`);
  }
});

//Route to handle Post Request Call for Customer Login
app.post("/customerLogin", function (req, res) {
  console.log("Inside Login Post Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  Customers.findOne({ Email: req.body.email }, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
    }
    console.log(result);
    if (result) {
      const isSame = await bcrypt.compare(req.body.password, result.Password);
      console.log(isSame);
      if (isSame === true) {
        console.log("login successfull!");
        res.cookie("cookie", "customer-admin", {
          maxAge: 3600000,
          httpOnly: false,
          path: "/",
        });
        resjson = {
          idCustomers: result._id.toString(),
          password: result.Password,
        };
        res.status(200).send(resjson);
      }
      else {
        console.log('Error:', err);
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("Unsuccessful Login");
      }
    }
    else {
      console.log('Error2:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
    }
  });
});

//Route to handle Post Request Call for Restaurant Login

app.post("/restaurantLogin", function (req, res) {
  console.log("Inside Restaurant Login Post Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  Restaurants.findOne({ Email: req.body.email }, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
    }
    console.log(result);
    if (result) {
      const isSame = await bcrypt.compare(req.body.password, result.Password);
      console.log(isSame);
      if (isSame === true) {
        console.log("login successfull!");
        res.cookie("cookie", "restaurant-admin", {
          maxAge: 3600000,
          httpOnly: false,
          path: "/",
        });
        resjson = {
          idRestaurants: result._id.toString(),
          password: result.Password,
        };
        res.status(200).send(resjson);
      }
      else {
        console.log('Error:', err);
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end("Unsuccessful Login");
      }
    }
    else {
      console.log('Error2:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful Login");
    }
  });

});

//Route to handle Post Request Call for Customer SignUp
app.post("/customerSignUp", function (req, res) {
  console.log("Inside SignUp Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }

  hashPassword(req.body.password).then((customerPassword) => {
    console.log("after Hash:", customerPassword);
    var CustomerProfile = new Customers({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: customerPassword
    });

    Customers.findOne({ Email: email }, (error, profile) => {
      if (error) {
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (profile) {
        res.writeHead(205, {
          'Content-Type': 'text/plain'
        })
        res.end("Customer Email ID already exists");
      }
      else {
        CustomerProfile.save((error, data) => {
          if (error) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            })
            res.end();
          }
          else {
            res.writeHead(200, {
              'Content-Type': 'text/plain'
            })
            console.log("Customer Profile Created");
            res.end();
          }
        });
      }
    });
  });
});

//Route to handle Post Request Call for Restaurant SignUp
app.post("/restaurantSignUp", async function (req, res) {
  console.log("Inside SignUp Request");
  console.log("Req Body : ", req.body);
  var email = req.body.email;
  var Name = req.body.restaurantname;
  var location = req.body.location;
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }
  var restaurantPassword = await hashPassword(req.body.password);
  var RestaurantProfile = new Restaurants({
    Name: Name,
    Location: location,
    Email: email,
    Password: restaurantPassword
  });
  Restaurants.findOne({ Email: email }, (error, profile) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (profile) {
      res.writeHead(205, {
        'Content-Type': 'text/plain'
      })
      res.end("Restaurant Email ID already exists");
    }
    else {
      RestaurantProfile.save((error, data) => {
        if (error) {
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          })
          res.end();
        }
        else {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          })
          console.log("Restaurant Profile Created");
          res.end();
        }
      });
    }
  });
});






// con.query("asdasd").then((result) => {

// }).catch()

// const results = await con.query("asdasdasd");


//Route to get restaurant Profile
app.get("/restaurantProfile", function (req, res) {
  console.log("Inside Restaurant Dashboard");
  var idRestaurants = req.query.idRestaurants;
  console.log(req.body, idRestaurants);
  Restaurants.findById(idRestaurants, (error, profile) => {
    if (error) {
      res.writeHead(400, {
        'Content-Type': 'text/plain'
      })
      res.end();
    }
    if (profile) {
      res.status(200).send(profile);
      console.log("get restaurant profile successful!");
    }
  });
});

//Route to get Customer Profile
app.get("/customerProfile", function (req, res) {
  console.log("Inside Customer profile section");
  var idCustomers = req.query.idCustomers;
  console.log(idCustomers);

  Customers.findById(idCustomers, (error, profile) => {
    if (error) {
      console.log(error);
      res.writeHead(400, {
        'Content-Type': 'text/plain'
      })
      res.end();
    }
    if (profile) {
      res.status(200).send(profile);
      console.log("get customer profile successful!", profile);
    }
  });
});

//Route to create a new Dish for a restaurant

app.post("/restaurantAddNewDish", function (req, res) {
  console.log("Inside Add new Dish Request");
  console.log("Req Body : ", req.body);
  var newDishDetails = {
    
      Name: req.body.dishName,
      Price: req.body.price,
      Category: req.body.category,
      Image: req.body.imageURL,
      Ingredients: req.body.ingredients
    };
  Restaurants.findByIdAndUpdate(req.body.idRestaurants, { $push:{dishes: newDishDetails} }, { useFindAndModify: false }, (error, dish) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (dish) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("Dish Edited");
      res.end("Dish Added");
    }
  });
});

// ADD events by restaurants
app.post("/restaurantAddNewEvent", function (req, res) {
  console.log("Inside Add new event Request");
  console.log("Req Body : ", req.body);
  var eventDetails = new Events({

    EventName: req.body.name,
    Description: req.body.description,
    Time: req.body.time,
    Date: req.body.date,
    Location: req.body.location,
    Hashtags: req.body.hashtags,
    restaurantevent: req.body.idRestaurants,
  });
  eventDetails.save((error, data) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      })
      console.log(error);
      res.end("Unable to Add new Event");
    }
    else {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("New Event Added");
      res.end("New Event Added");
    }
  });

});

//Update Menue Item By Customer
app.post("/restaurantEditNewDish", function (req, res) {
  console.log("Inside Update Dishes Edit section");

  var newDishDetails = {
    Name: req.body.dishName,
    Price: req.body.price,
    Category: req.body.category,
    Image: req.body.imageURL,
    Ingredients: req.body.ingredients,
  };
  //console.log("dishes:",newDishDetails);
  var set={};
  for (var field in newDishDetails) {
    set['dishes.$.' + field] = newDishDetails[field];
  }
  Restaurants.update({_id:req.body.idRestaurants,"dishes._id":req.body.idDishes}, { $set: set }, { useFindAndModify:false  }, (error, dish) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);

      res.end();
    }
    if (dish) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("Dish Edited");
      res.end("Dish Edited");
    }

  });


});

//Route to update Customer Profile
app.post("/updateCustomerProfile", function (req, res) {
  console.log("Inside Update customer profile section");
  console.log(req.body);
  var updatedValues = {
    FirstName: req.body.firstname,
    LastName: req.body.lastname,
    Email: req.body.email,
    Phone: req.body.phone,
    Favourites: req.body.favourites,
    DOB: req.body.dob,
    City: req.body.city,
    State: req.body.state,
    Country: req.body.country,
    NickName: req.body.nickname,
    About: req.body.about
  };

  Customers.findByIdAndUpdate(req.body.idCustomers, { $set: updatedValues }, { useFindAndModify: false }, (error, profile) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (profile) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end("Customer Profile Updated");
    }

  });

});

//Route to update Customer Password
app.post("/updateCustomerPassword", function (req, res) {
  console.log("Inside Update customer password section");
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }
  hashPassword(req.body.password).then((newPassword) => {


    Customers.findByIdAndUpdate(req.body.idCustomers, { Password: newPassword }, { useFindAndModify: false }, (error, profile) => {
      if (error) {
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (profile) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        res.end("Customer Password Updated");
      }

    });
  });

});

//Route to update restaurant password .
app.post("/updateRestaurantPassword", function (req, res) {
  console.log("Inside Update restaurant password section");
  async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash:", hash);
    return hash;
  }
  hashPassword(req.body.password).then((newPassword) => {

    Restaurants.findByIdAndUpdate(req.body.idRestaurants, { Password: newPassword }, { useFindAndModify: false }, (error, profile) => {
      if (error) {
        res.writeHead(205, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (profile) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        console.log("restaurant password updated");
        res.end("Restuarant Password Updated");
      }

    });
  });

});


//Route to post customer review
app.post("/postReview", function (req, res) {
  console.log("Inside post customer review section", req.body.restaurantID);
  var d = new Date();
  var newReview={
    customerID: req.body.customerID,
    ratings: req.body.ratings,
    comments: req.body.comments,
    time:d.getTime(),
  };
  Restaurants.findByIdAndUpdate(req.body.restaurantID, { $push:{reviews: newReview} }, { useFindAndModify: false }, (error, review) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);
      res.end();
    }
    if (review) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("Review Posted");
      res.end("Review Posted");
    }
  });


});


//Route to place order by customer 
app.post("/submitOrder", function (req, res) {
  console.log("Inside place order by customer  section", req.body.finalorder);
  var d = new Date();
  var newOrder={
    deliveryMode:req.body.deliverymode,
    orderStatus:"orderrecieved",
    time:d.getTime(),
    items:req.body.finalorder,
    idCustomers:req.body.idCustomers
  };

  Restaurants.findByIdAndUpdate(req.body.idRestaurants, { $push:{orders: newOrder} }, { useFindAndModify: false }, (error, order) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);
      res.end();
    }
    if (order) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("Order Placed");
      res.end("Order Placed");
    }
  });

});
//Route to update Restaurant Profile
app.post("/updateRestaurantProfile", function (req, res) {
  console.log("Inside Update Restaurant profile section");
  var updatedValues = {
    Name: req.body.name,
    Email: req.body.email,
    Password: req.body.password,
    Contact: req.body.contact,
    Location: req.body.location,
    Description: req.body.description,
    Timings: req.body.timings,
    deliveryMode: req.body.deliveryMode
  }

  Restaurants.findByIdAndUpdate(req.body.idRestaurants, { $set: updatedValues }, { useFindAndModify: false }, (error, profile) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (profile) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end("Restuarant Profile Updated");
    }

  });


});

//Route to register a customer to event
app.post("/registerCustomerEvent", function (req, res) {
  console.log("Inside register customer event section", req.body.idEvents);
  Events.findById(req.body.idEvents, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log("error1");
      res.end("Unsuccessful Login");
    }
    if (result) {
      var a = result.customerevent;
      if (a !== undefined && a.includes(req.body.idCustomers)) {
        res.status(205).send("Already exists");
        console.log("error2");
      }
      else {
        Events.findByIdAndUpdate(req.body.idEvents, { $push: { customerevent: req.body.idCustomers } }, { useFindAndModify: false }, (error, profile) => {
          if (error) {
            res.writeHead(205, {
              "Content-Type": "text/plain",
            });
            console.log("error3");
            res.end();
          }
          if (profile) {
            console.log("registered");
            res.writeHead(200, {
              'Content-Type': 'text/plain'
            })
            res.end("Event registered");
          }

        });

      }
    }
  });

});

app.post("/followUser", function (req, res) {
  console.log("Inside register follow user section", req.body.idCustomers,req.body.idToFollow);
  Customers.findById(req.body.idCustomers, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log("error1");
      res.end("Unsuccessful follow");
    }
    if (result) {
      var a = result.following;
      if (a !== undefined && a.includes(req.body.idToFollow)) {
        res.status(205).send("Already exists");
        console.log("error2");
      }
      else {
        Customers.findByIdAndUpdate(req.body.idCustomers, { $push: { following: req.body.idToFollow } }, { useFindAndModify: false }, (error, profile) => {
          if (error) {
            res.writeHead(205, {
              "Content-Type": "text/plain",
            });
            console.log("error3");
            res.end();
          }
          if (profile) {
            console.log("following");
            res.writeHead(200, {
              'Content-Type': 'text/plain'
            })
            res.end("user follow successful");
          }

        });

      }
    }
  });

});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantOrders", function (req, res) {
  console.log("Inside Restaurant orders section");
  Restaurants.findById( req.query.idRestaurants , async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch all the Orders for this restaurant");
    }
    else {
      res.status(200).send(result);
      console.log("Get Orders Successful");
    }
  });
});

//get restaurant dishes
app.get("/getRestaurantDishes", function (req, res) {
  console.log("Inside Restaurant dishes get section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  Restaurants.findById( idRestaurants , async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch all the Dishes");
    }
    else {
      res.status(200).send(result);
      console.log("Get Dishes Successful");
    }
  });
});

//Route to list of events for a restaurant
app.get("/getRestaurantEvents", function (req, res) {
  console.log("Inside Restaurant Events section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  Events.find({ restaurantevent: idRestaurants }, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch Events");
    }
    else {
      res.status(200).send(result);
      console.log("Get Events Successful");
    }
  });
});

//Route to list upcoming events for customers 
app.get("/getUpcomingEvents", async function (req, res) {
  console.log("Inside Upcoming Events section", req.query.name);
  Events.find({}).
    populate('restaurantevent', 'Name').
    exec(function (err, eventInfo) {
      if (err) return handleError(err);
      console.log('The Event is:', JSON.stringify(eventInfo));
      res.status(200).send(eventInfo);
    });
});

//Route for customer list for a event for restaurants
app.get("/getCustomerListEvent", function (req, res) {
  console.log("Inside Customer list events section", req.query.idEvents);
  Events.findById(req.query.idEvents, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch Events");
    }
    else {
      res.status(200).send(result);
      console.log("********************", result);
    }
  }).populate('customerevent');
});

//Route to list upcoming events for customers 
app.get("/getRegisteredEvents", function (req, res) {
  console.log("Inside Registered Events section", req.query.idCustomers);
  Events.find({ customerevent: req.query.idCustomers }, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch Events");
    }
    else {
      res.status(200).send(result);
      console.log("********************", result);
    }
  }).populate('restaurantevent', 'Name');

});
//Route to list following for customers 
app.get("/getFollowing", function (req, res) {
  console.log("Inside get following section", req.query.idCustomers);
  Customers.findById(req.query.idCustomers , async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch Events");
    }
    else {
      res.status(200).send(result);
      console.log("********************", result);
    }
  }).populate('following');

});



//Route to list of search events by customers 
app.get("/getSearchEvents", function (req, res) {
  console.log("Inside Search Events section", req.query.name);
  Events.find({ EventName: req.query.name }).populate('restaurantevent', 'Name').
    exec(function (err, eventInfo) {
      if (err) return handleError(err);
      console.log('The Event is:', JSON.stringify(eventInfo));
      res.status(200).send(eventInfo);
    });
});

//Route to list of search restaurants by customers 
app.get("/getSearchRestaurants", function (req, res) {
  console.log("Inside Search Restaurants section:", req.query.searchterm, req.query.category);

  switch (req.query.category) {
    case "location":
      Restaurants.find({Location:req.query.searchterm}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search on location");
        }
        else {
          res.status(200).send(result);
          console.log("search restaurants successfull");
        }
      });

      break;
    case "cuisine":
      Restaurants.find({Cuisine:req.query.searchterm}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search on cuisine");
        }
        else {
          res.status(200).send(result);
          console.log("search restaurants successfull");
        }
      });
      break;
    case "dishes":
      Restaurants.find({dishes :  {$elemMatch: {Name: req.query.searchterm}}}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search on Dishes");
        }
        else {
          res.status(200).send(result);
          console.log("search restaurants successfull",result);
        }
      });
      break;
    case "deliveryMode":
      Restaurants.find({deliveryMode:req.query.searchterm}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search on deliveryMode");
        }
        else {
          res.status(200).send(result);
          console.log("search restaurants successfull");
        }
      });

      break;
  }



});

//Route to list of search restaurants by customers 
app.get("/getSearchUsers", function (req, res) {
  console.log("Inside Search Users section:", req.query.searchterm, req.query.category);

  switch (req.query.category) {
    case "Location":
      Customers.find({City:req.query.searchterm}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search users on location");
        }
        else {
          res.status(200).send(result);
          console.log("search users on location successfull");
        }
      });

      break;
    case "FirstName":
      Customers.find({FirstName:req.query.searchterm}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search on firstname");
        }
        else {
          res.status(200).send(result);
          console.log("search users successfull");
        }
      });
      break;
    case "NickName":
      Customers.find({NickName:req.query.searchterm}, async function (err, result) {
        if (err) {
          console.log('Mongo Error:', err);
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end("Unsuccessful search on nickname");
        }
        else {
          res.status(200).send(result);
          console.log("search pon nickname successfull",result);
        }
      });
      break;
  }



});





//Route to list of reviews for a restaurant
app.get("/getRestaurantReviews", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.query.idRestaurants;
  console.log("reviews for restaurant :", idRestaurants);
  Restaurants.findById(idRestaurants, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch Events");
    }
    else {
      res.status(200).send(result);
      console.log("********************", result);
    }
  })
});


//Route to list of orders by restaurants for a customer
app.get("/getCustomerOrders", function (req, res) {
  console.log("Inside Customers orders section");
  var idCustomers = req.query.idCustomers;
  console.log(idCustomers);
  Restaurants.find({ "orders.idCustomers": req.query.idCustomers }, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch Events");
    }
    else {
      res.status(200).send(result);
      console.log("********************", result);
    }
  })

});

//Route to list of orders by restaurants for a customer
app.get("/getAllUsers", function (req, res) {
  console.log("Inside get all users section");
  Customers.find({}, async function (err, result) {
    if (err) {
      console.log('Mongo Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("Unsuccessful To fetch all users");
    }
    else {
      res.status(200).send(result);
      console.log("********************", result);
    }
  })

});



//Route to update order status through restaurant
app.post("/updateOrderStatus", function (req, res) {
  console.log("Inside Update Order Status");
  //console.log("dishes:",newDishDetails);

  Restaurants.updateOne({_id:req.body.idRestaurants,"orders._id":req.body.idOrders}, { $set:{"orders.$.orderStatus":req.body.orderstatus} }, { useFindAndModify:false  }, (error, order) => {
    if (error) {
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      console.log(error);

      res.end();
    }
    if (order) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      console.log("Status Updated");
      res.end("Status Updated");
    }

  });

});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
