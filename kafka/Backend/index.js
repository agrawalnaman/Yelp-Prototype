//import the require dependencies

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var kafka = require('./kafka/client');
var session = require("express-session");
var cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
const bcrypt = require('bcrypt');
const { response } = require("express");
module.exports = app;
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const { secret } = require('./kafka/Utils/config');
//const Users = require('../Models/UserModel');
const { auth } = require("./kafka/Utils/passport");
const { checkAuth } = require("./kafka/Utils/passport");
auth();
var multer = require('multer');
var upload = multer({dest:'../../Frontend/src/uploads'});
const Customers = require('./kafka/Models/Customer');

//var upload = multer({ storage: storage });


//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

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

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
  };
  
const { mongoDB } = require('./kafka/Utils/config');
const mongoose = require('mongoose');
mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
    } else {
      console.log(`MongoDB Connected`);
    }
  });


//Route to get All Books when user visits the Home Page
/*app.get('/books', function(req,res){   
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    res.end(JSON.stringify(books));
    
});
*/


//Route to handle Post Request Call for Customer Login
app.post("/customerLogin", function (req, res) {
    console.log("Inside Login Post Request");
    kafka.make_request('customerLogin', req.body, function (err, results) {
        console.log('in customerLogin');
        console.log(results);
        if (err) {
            console.log("Inside err customerLogin");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Login");
        } else {
            console.log("Inside else customerLogin");
            const payload = { _id: results.data.idCustomers};
            const token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            });
            console.log("%%%%%%%%4444:",results.data.idCustomers);
            if (results.status === 200) {
                res.status(200).end("JWT " + token);
                //res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
            }
        }

    });


});

app.post("/restaurantLogin", function (req, res) {
    console.log("Inside Restaurant Login Post Request");
    console.log("Req Body : ", req.body);
    kafka.make_request('restaurantLogin', req.body, function (err, results) {
        console.log('in restaurantLogin');
        console.log(results);
        if (err) {
            console.log("Inside err restaurantLogin");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Login");
        } else {
            console.log("Inside else restaurantLogin");
            if (results.status === 200) {
                const payload = { _id: results.data.idRestaurants};
                const token = jwt.sign(payload, secret, {
                    expiresIn: 1008000
                });
                console.log("r_id",results.data.idRestaurants);
                res.status(200).end("JWT " + token);
            } else {
                res.status(results.status).send(results.message);
            }
        }

    });
});

//Route to handle Post Request Call for Customer SignUp
app.post("/customerSignUp", function (req, res) {
    console.log("Inside customer SignUp Request");
    console.log("Req Body : ", req.body);
    kafka.make_request('customerSignup', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err customer SignUp");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Signup");
        } else {
            console.log("Inside else customer SignUp");
            res.status(results.status).send(results.message);
        }


    });

});


//Route to handle Post Request Call for Restaurant SignUp
app.post("/restaurantSignUp", function (req, res) {
    console.log("Inside SignUp Request");
    console.log("Req Body : ", req.body);
    kafka.make_request('restaurantSignup', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Signup");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Signup");
        } else {
            console.log("Inside else Restaurant Signup");
            res.status(results.status).send(results.message);
        }


    });
});


//Route to get restaurant Profile
app.get("/restaurantProfile",checkAuth, function (req, res) {
    console.log("Inside Restaurant Dashboard");
    kafka.make_request('restaurantProfile', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Profile get");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Profile get");
        } else {
            console.log("Inside else Restaurant Profile get");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Restaurant Profile Success");
            }
        }


    });
});


//Route to get Customer Profile
app.get("/customerProfile",checkAuth, function (req, res) {
    console.log("Inside Customer profile section");
    kafka.make_request('customerProfile', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Customer Profile get");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Profile get");
        } else {
            console.log("Inside else Customer Profile get");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Customer Profile Success");
            }
        }
    });

});


app.post("/restaurantAddNewDish",checkAuth, function (req, res) {
    console.log("Inside Add new Dish Request");
    console.log("Req Body : ", req.body);

    kafka.make_request('restaurantAddNewDish', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Add New Dish ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Add New Dish");
        } else {
            console.log("Inside else Restaurant Add New Dish ");
           
                res.status(results.status).send(results.message);
        }
    });
});


// ADD events by restaurants
app.post("/restaurantAddNewEvent",checkAuth, function (req, res) {
    console.log("Inside Add new event Request");
    console.log("Req Body : ", req.body);
    kafka.make_request('restaurantAddNewEvent', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Add New Event ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Add New Event");
        } else {
            console.log("Inside else Restaurant Add New Event ");
           
                res.status(results.status).send(results.message);
        }
    });
});

//Update Menue Item By Customer
app.post("/restaurantEditNewDish",checkAuth, function (req, res) {
    console.log("Inside Update Dishes Edit section");
    kafka.make_request('restaurantEditNewDish', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Edit Dish ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Edit Dish");
        } else {
            console.log("Inside else Restaurant Edit Dish ");
           
                res.status(results.status).send(results.message);
        }
    });
});


//Route to update Customer Profile
app.post("/updateCustomerProfile",checkAuth, function (req, res) {
    console.log("Inside Update customer profile section");
    console.log(req.body);
    kafka.make_request('updateCustomerProfile', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err update CustomerProfile ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Update Customer Profile");
        } else {
            console.log("Inside else update CustomerProfile ");
           
                res.status(results.status).send(results.message);
        }
    });
});

//Route to update Customer Password
app.post("/updateCustomerPassword",checkAuth, function (req, res) {
    console.log("Inside Update customer password section");
    kafka.make_request('updateCustomerPassword', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err update CustomerPassword ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Update Customer Password");
        } else {
            console.log("Inside else update CustomerPassword ");
           
                res.status(results.status).send(results.message);
        }
    });
});

//Route to update restaurant password .
app.post("/updateRestaurantPassword",checkAuth, function (req, res) {
    console.log("Inside Update restaurant password section");
    kafka.make_request('updateRestaurantPassword', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err update Restaurant Password ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Update Restaurant Password");
        } else {
            console.log("Inside else update Restaurant Password ");
           
                res.status(results.status).send(results.message);
        }
    });
});


//Route to place order by customer 
app.post("/submitOrder",checkAuth, function (req, res) {
    console.log("Inside place order by customer  section", req.body.finalorder);
    kafka.make_request('submitOrder', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Place Order ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Place Order");
        } else {
            console.log("Inside else Place Order ");
           
                res.status(results.status).send(results.message);
        }
    });


});


//Route to post customer review
app.post("/postReview",checkAuth, function (req, res) {
    console.log("Inside post customer review section", req.body.restaurantID);
    kafka.make_request('postReview', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Post Review ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Post Review");
        } else {
            console.log("Inside else Post Review ");
           
                res.status(results.status).send(results.message);
        }
    });


});

//Route to update Restaurant Profile
app.post("/updateRestaurantProfile",checkAuth, function (req, res) {
    console.log("Inside Update Restaurant profile section");
    kafka.make_request('updateRestaurantProfile', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err update Restaurant Profile ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Update Restaurant Profile");
        } else {
            console.log("Inside else update Restaurant Profile ");
           
                res.status(results.status).send(results.message);
        }
    });

});


//Route to register a customer to event
app.post("/registerCustomerEvent",checkAuth, function (req, res) {
    console.log("Inside register customer event section", req.body.idEvents);

  kafka.make_request('registerCustomerEvent', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Register Customer Event ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Register Customer Event");
        } else {
            console.log("Inside else Register Customer Event ");
           
                res.status(results.status).send(results.message);
        }
    });

});

app.post("/followUser",checkAuth, function (req, res) {
    console.log("Inside register follow user section", req.body.idCustomers,req.body.idToFollow);
    kafka.make_request('followUser', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err follow user ");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful follow user");
        } else {
            console.log("Inside else follow user ");
           
                res.status(results.status).send(results.message);
        }
    });
});

//Route to list of orders by customers for a restaurant
app.get("/getRestaurantOrders",checkAuth, function (req, res) {
    console.log("Inside Restaurant orders section",req.query);
    kafka.make_request('getRestaurantOrders', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Orders");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Restaurant Orders get");
        } else {
            console.log("Inside else Restaurant Orders");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Restaurant Orders get Success");
            }
        }
    });
});


//get restaurant dishes
app.get("/getRestaurantDishes",checkAuth, function (req, res) {
    console.log("Inside Restaurant dishes get section",req.query);
    kafka.make_request('getRestaurantDishes', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Dishes");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Restaurant Dishes get");
        } else {
            console.log("Inside else Restaurant Dishes");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Restaurant Dishes get Success");
            }
        }
    });

});

//Route to list of events for a restaurant
app.get("/getRestaurantEvents",checkAuth, function (req, res) {
    console.log("Inside Restaurant Events section",req.query);
    kafka.make_request('getRestaurantEvents', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Restaurant Events");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Restaurant Events get");
        } else {
            console.log("Inside else Restaurant Events");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Restaurant Events get Success");
            }
        }
    });
});

//Route to list upcoming events for customers 
app.get("/getUpcomingEvents",checkAuth, async function (req, res) {
    console.log("Inside Upcoming Events section", req.query.name);
    kafka.make_request('getUpcomingEvents', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Upcoming Events");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Upcoming Events get");
        } else {
            console.log("Inside else Upcoming Events");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Upcoming Events get Success");
            }
        }
    });
});

//Route for customer list for a event for restaurants
app.get("/getCustomerListEvent",checkAuth, function (req, res) {
    console.log("Inside Customer list events section", req.query.idEvents);
    kafka.make_request('getCustomerListEvent', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Customer list Events");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Customer list Events get");
        } else {
            console.log("Inside else Customer list Events");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Customer list Events get Success");
            }
        }
    });
});


//Route to list upcoming events for customers 
app.get("/getRegisteredEvents",checkAuth, function (req, res) {
    console.log("Inside Registered Events section", req.query.idCustomers);
    kafka.make_request('getRegisteredEvents', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err Customer Registered list Events");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful Customer Registered list Events get");
        } else {
            console.log("Inside else Customer Registered list Events");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("Customer Registered list Events get Success");
            }
        }
    });
});

//Route to list following for customers 
app.get("/getFollowing",checkAuth, function (req, res) {
    console.log("Inside get following section", req.query.idCustomers);
    kafka.make_request('getFollowing', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err get following");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful get following ");
        } else {
            console.log("Inside else get following");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("get following Success");
            }
        }
    });

});


//Route to list of search events by customers 
app.get("/getSearchEvents",checkAuth, function (req, res) {
    console.log("Inside Search Events section", req.query.name);
    kafka.make_request('getSearchEvents', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err get search events");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful get search events ");
        } else {
            console.log("Inside else get search events");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("get search events Success");
            }
        }
    });
});

//Route to list of search restaurants by customers 
app.get("/getSearchRestaurants",checkAuth, function (req, res) {
    console.log("Inside Search Restaurants section:", req.query.searchterm, req.query.category);

        kafka.make_request('getSearchRestaurants', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err get search Restaurants");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful get search Restaurants ");
        } else {
            console.log("Inside else get search Restaurants");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(205).send(results.message);
                console.log("get search Restaurants fail");
            }
        }
    });

});



//Route to list of search restaurants by customers 
app.get("/getSearchUsers",checkAuth, function (req, res) {
    console.log("Inside Search Users section:", req.query.searchterm, req.query.category);
    kafka.make_request('getSearchUsers', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err get search Users");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful get search Users ");
        } else {
            console.log("Inside else get search Users");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("get search Users Success");
            }
        }
    });
    
});



//Route to list of reviews for a restaurant
app.get("/getRestaurantReviews",checkAuth, function (req, res) {
    console.log("Inside Restaurant orders section");
    kafka.make_request('getRestaurantReviews', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err get restaurant reviews");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful get restaurant reviews ");
        } else {
            console.log("Inside else get restaurant reviews");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("get restaurant reviews Success");
            }
        }
    });

});


//Route to list of orders by restaurants for a customer
app.get("/getCustomerOrders",checkAuth, function (req, res) {
    console.log("Inside Customers orders section");
    kafka.make_request('getCustomerOrders', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err getCustomerOrders");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful getCustomerOrders ");
        } else {
            console.log("Inside else getCustomerOrders");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("getCustomerOrders Success");
            }
        }
    });
});

//Route to list of orders by restaurants for a customer
app.get("/getAllUsers",checkAuth, function (req, res) {
    console.log("Inside get all users section");
    kafka.make_request('getAllUsers', req.query, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err getAllUsers");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful getAllUsers ");
        } else {
            console.log("Inside else getAllUsers");
            if (results.status === 200) {
                res.status(results.status).send(results.data);
            } else {
                res.status(results.status).send(results.message);
                console.log("getAllUsers Success");
            }
        }
    });
});


//Route to update order status through restaurant
app.post("/updateOrderStatus",checkAuth, function (req, res) {
    console.log("Inside Update Order Status");

    kafka.make_request('updateOrderStatus', req.body, function (err, results) {
        console.log(results);
        if (err) {
            console.log("Inside err updateOrderStatus");
            res.writeHead(205, {
                "Content-Type": "text/plain",
            });
            res.end("Unsuccessful updateOrderStatus ");
        } else {
            console.log("Inside else updateOrderStatus");
                res.status(results.status).send(results.message);
            }
        
    });

});


app.post('/single',upload.single('profile'), async (req, res) => {
    try {
        console.log("#### id customers:",req.body.idCustomers);
        console.log("#### file:",req.file);
      await  Customers.findByIdAndUpdate(req.body.idCustomers, { ProfilePicPath: req.file.path }, { useFindAndModify: false }, (error, profile) => {
        if (error) {
          res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          res.end();
        }
        if (profile) {
            res.status(200).send(req.file);
        }
  
      });
 
    }catch(err) {
        res.writeHead(205, {
            "Content-Type": "text/plain",
          });
          console.log(err);
          res.end();
    }
  });
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");