
//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");
const bcrypt = require('bcrypt');
//connect to MySQL
var mysql = require('mysql');
const { response } = require("express");
module.exports = app;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Yelp",
});

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
  Customers.findOne({ Email: req.body.email}, async function (err, result) {
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
  Restaurants.findOne({ Email: req.body.email}, async function (err, result) {
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
          res.cookie("cookie", "resturant-admin", {
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
  var sql_findEmail = "SELECT * FROM Restaurants WHERE Email = ?";
  var sql_insert = "INSERT INTO Restaurants (Email,Name,Password,Location) VALUES (?,?,?,?)";


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
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        })
        res.end();
    }
    if (profile) {
      res.status(200).send(profile);
      console.log("get customer profile successful!");
    }
  });
});

//Route to create a new Dish for a restaurant

app.post("/restaurantAddNewDish", function (req, res) {
  console.log("Inside Add new Dish Request");
  console.log("Req Body : ", req.body);
  var idRestaurants = req.body.idRestaurants;
  var dishName = req.body.dishName;
  var price = req.body.price;
  var category = req.body.category;
  var imageURL = req.body.imageURL;
  var ingredients = req.body.ingredients;
  var sql_insert = "INSERT INTO Dishes (Name,Price,Ingredients,Image,Category,restaurantID) VALUES (?,?,?,?,?,?);";
  con.query(sql_insert, [dishName, price, ingredients, imageURL, category, idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("failed to add new dish");
    }
    else {
      console.log("add new dish successfull!");
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("added new dish");
    }
  });

});

// ADD events by restaurants
app.post("/restaurantAddNewEvent", function (req, res) {
  console.log("Inside Add new event Request");
  console.log("Req Body : ", req.body);
  var idRestaurants = req.body.idRestaurants;
  var Name = req.body.name;
  var Description = req.body.description;
  var Time = req.body.time;
  var Date = req.body.date;
  var Location = req.body.location;
  var Hashtags = req.body.hashtags;
  var sql_insert = "INSERT INTO Events (`EventName`, `Description`, `Time`, `Date`, `Location`, `Hashtags`, `restaurantID`) VALUES (?,?,?,?,?,?,?);";
  con.query(sql_insert, [Name, Description, Time, Date, Location, Hashtags, idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.writeHead(205, {
        "Content-Type": "text/plain",
      });
      res.end("failed to add new event");
    }
    else {
      console.log("add new dish successfull!");
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("added new event");
    }
  });

});

//Update Menue Item By Customer
app.post("/restaurantEditNewDish", function (req, res) {
  console.log("Inside Update Dishes Edit section");
  var idRestaurants = req.body.idRestaurants;
  var idDishes = req.body.idDishes;
  var dishName = req.body.dishName;
  var price = req.body.price;
  var category = req.body.category;
  var imageURL = req.body.imageURL;
  var ingredients = req.body.ingredients;
  var sql = "UPDATE Dishes SET Name= ?,Price= ?,Ingredients=?,Image=?,Category=? WHERE idDishes = ? ";
  con.query(sql, [dishName, price, ingredients, imageURL, category, idDishes], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Edit Dishes");
    }
    else {
      res.status(200).send("Dish UPDATED");
    }
  });

});

//Route to update Customer Profile
app.post("/updateCustomerProfile", function (req, res) {
  console.log("Inside Update customer profile section");

  var updatedValues={
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
  } 

  Customers.findByIdAndUpdate(req.body.idCustomers,{ $set: updatedValues}, {useFindAndModify: false}, (error, profile) => {
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


    Customers.findByIdAndUpdate(req.body.idCustomers,{Password:newPassword}, {useFindAndModify: false}, (error, profile) => {
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

    Restaurants.findByIdAndUpdate(req.body.idRestaurants,{Password:newPassword}, {useFindAndModify: false}, (error, profile) => {
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
  var sql = "INSERT INTO Reviews ( `restaurantID`, `customerID`, `reviewDate`, `ratings`, `comments`) VALUES (?, ?, now(), ?, ?)";
  con.query(sql, [req.body.restaurantID, req.body.customerID, req.body.ratings, req.body.comments], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Post Review");
    }
    else {
      res.status(200).send("Review Posted");
    }
  });

});


//Route to place order by customer 
app.post("/submitOrder", function (req, res) {
  console.log("Inside place order by customer  section", req.body);
  var sql = "INSERT INTO Orders (deliveryMode,customerID,restaurantID,time,orderStatus) VALUES (?,?,?,now(),?)";
  var sql1 = "INSERT INTO OrderDetails (`orderID`, `dishID`, `quantity`) VALUES (?, ?, ?)";
  con.query(sql, [req.body.deliverymode, req.body.idCustomers, req.body.finalorder[0].restaurantID, "orderrecieved"], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To submit Order");
    }
    else {

      req.body.finalorder.forEach(function (orderItem) {

        con.query(sql1, [result.insertId, orderItem.idDishes, orderItem.quantity], function (err, result) {
          if (err) {
            console.log('SQL Error:', err);
            res.status(205).send("Unsuccessful to insert into order details");
          }
        });

      });
      console.log("last transaction id:", result);
      res.status(200).send("order Submitted");
    }
  });

});
//Route to update Restaurant Profile
app.post("/updateRestaurantProfile", function (req, res) {
  console.log("Inside Update Restaurant profile section");
  var updatedValues={
    Name: req.body.name,
    Email: req.body.email,
    Password: req.body.password,
    Contact: req.body.contact,
    Location: req.body.location,
    Description: req.body.description,
    Timings: req.body.timings,
    deliveryMode:req.body.deliveryMode
   } 
 
   Restaurants.findByIdAndUpdate(req.body.idRestaurants,{ $set: updatedValues}, {useFindAndModify: false}, (error, profile) => {
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
  var sql1 = "INSERT INTO EventRegistration (`EventID`, `CustomerID`) VALUES (?, ?)";
  var sql2 = "SELECT * From EventRegistration where CustomerID=? AND EventID=?";
  //var sql = "UPDATE Restaurants SET Name= ?,Email= ?,Password=?,Contact=?,Location=?,Description=?,Timings=?,PictureOfRestaurants=?,PicturesOfDishes=? WHERE idRestaurants = ? ";
  con.query(sql2, [req.body.idCustomers, req.body.idEvents], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To register to event");
    }
    else {
      if (result.length === 0) {

        con.query(sql1, [req.body.idEvents, req.body.idCustomers], function (err, result) {
          if (err) {
            console.log('SQL Error:', err);
            res.status(205).send("Unsuccessful To register to event");
          }
          else {
            res.status(200).send("Registered to Event");
          }

        });

      }
      else {
        res.status(205).send("Unsuccessful To register to event");

      }

    }
  });

});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantOrders", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Orders WHERE restaurantID = ? order by customerID";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantDishes", function (req, res) {
  console.log("Inside Restaurant orders section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Dishes WHERE restaurantID = ? order by Category";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to list of events for a restaurant
app.get("/getRestaurantEvents", function (req, res) {
  console.log("Inside Restaurant Events section");
  var idRestaurants = req.query.idRestaurants;
  console.log(idRestaurants);
  var sql = "SELECT * FROM Events WHERE restaurantID = ?";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to list upcoming events for customers 
app.get("/getUpcomingEvents", function (req, res) {
  console.log("Inside Upcoming Events section", req.query.name);
  var sql1 = "SELECT Events.*, Restaurants.Name FROM Events INNER JOIN Restaurants ON Events.restaurantID=Restaurants.idRestaurants";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1, function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Search Event");
    }
    else {
      if (result.length === 0) {
        res.status(205).send("events not found");
      }
      else {
        res.status(200).send(result);
        console.log("event search success", result);
      }
    }
  });
});

//Route for customer list for a event for restaurants
app.get("/getCustomerListEvent", function (req, res) {
  console.log("Inside Customer list events section", req.query.idEvents);
  var sql1 = "SELECT Customers.* FROM EventRegistration INNER JOIN Customers ON Customers.idCustomers=EventRegistration.CustomerID WHERE EventRegistration.EventID=?";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1, [req.query.idEvents], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To fetch list of customers");
    }
    else {
      if (result.length === 0) {
        res.status(205).send("Customers not found");
      }
      else {
        res.status(200).send(result);
        console.log("event search success", result);
      }
    }
  });
});

//Route to list upcoming events for customers 
app.get("/getRegisteredEvents", function (req, res) {
  console.log("Inside Registered Events section", req.query.idCustomers);
  var sql1 = "SELECT Events.* FROM Events INNER JOIN EventRegistration ON EventRegistration.EventID=Events.idEvents where EventRegistration.CustomerID=?";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1, [req.query.idCustomers], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Search Event");
    }
    else {
      if (result.length === 0) {
        res.status(205).send("events not found");
      }
      else {
        res.status(200).send(result);
        console.log("event search success", result);
      }
    }
  });
});


//Route to list of search events by customers 
app.get("/getSearchEvents", function (req, res) {
  console.log("Inside Search Events section", req.query.name);
  var sql1 = "SELECT Events.*, Restaurants.Name FROM Events INNER JOIN Restaurants ON Events.restaurantID=Restaurants.idRestaurants WHERE EventName = ?";
  //var sql = "SELECT * FROM Events WHERE Name = ?";
  con.query(sql1, [req.query.name], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To Search Event");
    }
    else {
      if (result.length === 0) {
        res.status(205).send("event not found");
      }
      else {
        res.status(200).send(result);
        console.log("event search success", result);
      }
    }
  });
});

//Route to list of search restaurants by customers 
app.get("/getSearchRestaurants", function (req, res) {
  console.log("Inside Search Restaurants section:", req.query.searchterm, req.query.category);

  switch (req.query.category) {
    case "location":
      var sql1 = "SELECT * FROM Restaurants WHERE Location = ?";
      con.query(sql1, [req.query.searchterm], function (err, result) {
        if (err) {
          console.log('SQL Error:', err);
          res.status(205).send("Unsuccessful To Search Event");
        }
        else {
          if (result.length === 0) {
            res.status(205).send("event not found");
          }
          else {
            res.status(200).send(result);
            console.log("event search success", result);
          }
        }
      });
      break;
    case "cuisine":
      var sql1 = "SELECT * FROM Restaurants WHERE Cuisine = ?";
      con.query(sql1, [req.query.searchterm], function (err, result) {
        if (err) {
          console.log('SQL Error:', err);
          res.status(205).send("Unsuccessful To Search Event");
        }
        else {
          if (result.length === 0) {
            res.status(205).send("event not found");
            console.log("not found");
          }
          else {
            res.status(200).send(result);
            console.log("event search success", result);
          }
        }
      });
      break;
    case "dishes":
      var sql1 = "SELECT DISTINCT Restaurants.* FROM Dishes INNER JOIN Restaurants ON Dishes.restaurantID = Restaurants.idRestaurants WHERE Dishes.Name = ?";
      con.query(sql1, [req.query.searchterm], function (err, result) {
        if (err) {
          console.log('SQL Error:', err);
          res.status(205).send("Unsuccessful To Search Event");
        }
        else {
          if (result.length === 0) {
            res.status(205).send("event not found");
            console.log("not found");
          }
          else {
            res.status(200).send(result);
            console.log("event search success", result);
          }
        }
      });
      break;
    case "deliveryMode":
      var sql1 = "SELECT * FROM Restaurants WHERE deliveryMode = ?";
      con.query(sql1, [req.query.searchterm], function (err, result) {
        if (err) {
          console.log('SQL Error:', err);
          res.status(205).send("Unsuccessful To Search Event");
        }
        else {
          if (result.length === 0) {
            res.status(205).send("event not found");
            console.log("not found");
          }
          else {
            res.status(200).send(result);
            console.log("event search success", result);
          }
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
  var sql = "SELECT * FROM Reviews WHERE `restaurantID` = ? order by `customerID`";
  con.query(sql, [idRestaurants], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(400).send("Unsuccessful To find review list");
    }
    else {
      res.status(200).send(result);
    }
  });
});


//Route to list of orders by restaurants for a customer
app.get("/getCustomerOrders", function (req, res) {
  console.log("Inside Customers orders section");
  var idCustomers = req.query.idCustomers;
  console.log(idCustomers);
  var sql = "SELECT * FROM Orders WHERE customerID = ? order by restaurantID";
  con.query(sql, [idCustomers], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});

//Route to get customer order details
app.get("/getCustomerOrderDetails", function (req, res) {
  console.log("Inside Customers orders details section");
  var idOrders = req.query.idOrders;
  console.log(idOrders);
  var sql = "SELECT Dishes.*,OrderDetails.quantity FROM OrderDetails INNER JOIN Dishes ON OrderDetails.dishID = Dishes.idDishes WHERE OrderDetails.orderID = ?";
  con.query(sql, [idOrders], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To orders list");
    }
    else {
      res.status(200).send(result);
    }
  });
});


//Route to update order status through restaurant
app.post("/updateOrderStatus", function (req, res) {
  console.log("Inside Update Order Status");
  console.log(req.body.orderstatus, req.body.idOrders)
  var sql = "UPDATE Orders SET orderStatus= ? WHERE idOrders = ? ";
  con.query(sql, [req.body.orderstatus, req.body.idOrders], function (err, result) {
    if (err) {
      console.log('SQL Error:', err);
      res.status(205).send("Unsuccessful To update details");
    }
    else {
      res.status(200).send("Order Status UPDATED");
    }
  });

});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
