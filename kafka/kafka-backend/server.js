var connection =  new require('./kafka/Connection');
const customerLogin = require('./services/customerLogin');
const restaurantLogin = require('./services/restaurantLogin');
const customerSignup = require('./services/customerSignup');
const restaurantSignup = require('./services/restaurantSignup');
const restaurantProfile = require('./services/restaurantProfile');
const customerProfile = require('./services/customerProfile');
const restaurantAddNewDish = require('./services/restaurantAddNewDish');
const restaurantAddNewEvent = require('./services/restaurantAddNewEvent');
const restaurantEditNewDish = require('./services/restaurantEditNewDish');
const updateCustomerProfile = require('./services/updateCustomerProfile');
const updateCustomerPassword = require('./services/updateCustomerPassword');
const updateRestaurantPassword = require('./services/updateRestaurantPassword');
const updateRestaurantProfile = require('./services/updateRestaurantProfile');
const submitOrder = require('./services/submitOrder');
const postReview = require('./services/postReview');
const registerCustomerEvent = require('./services/registerCustomerEvent');
const followUser = require('./services/followUser');
const getRestaurantOrders =require('./services/getRestaurantOrders');
const getRestaurantDishes =require('./services/getRestaurantDishes');
const getRestaurantEvents =require('./services/getRestaurantEvents');
const getUpcomingEvents =require('./services/getUpcomingEvents');
const getCustomerListEvent =require('./services/getCustomerListEvent');
const getRegisteredEvents =require('./services/getRegisteredEvents');
const getFollowing =require('./services/getFollowing');
const getSearchEvents =require('./services/getSearchEvents');
const getSearchRestaurants =require('./services/getSearchRestaurants');
const getSearchUsers =require('./services/getSearchUsers');
const getRestaurantReviews =require('./services/getRestaurantReviews');
const getCustomerOrders =require('./services/getCustomerOrders');
const getAllUsers =require('./services/getAllUsers');
const updateOrderStatus =require('./services/updateOrderStatus');
//topics files
//var signin = require('./services/signin.js');
var Books = require('./services/books.js');
const { mongoDB } = require('./config');
const mongoose = require('mongoose');
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
  
function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("customerLogin",customerLogin);
handleTopicRequest("restaurantLogin",restaurantLogin);
handleTopicRequest("customerSignup",customerSignup);
handleTopicRequest("restaurantSignup",restaurantSignup);
handleTopicRequest("restaurantProfile",restaurantProfile);
handleTopicRequest("customerProfile",customerProfile);
handleTopicRequest("restaurantAddNewDish",restaurantAddNewDish);
handleTopicRequest("restaurantAddNewEvent",restaurantAddNewEvent);
handleTopicRequest("restaurantEditNewDish",restaurantEditNewDish);
handleTopicRequest("updateCustomerProfile",updateCustomerProfile);
handleTopicRequest("updateCustomerPassword",updateCustomerPassword);
handleTopicRequest("updateRestaurantPassword",updateRestaurantPassword);
handleTopicRequest("updateRestaurantProfile",updateRestaurantProfile);
handleTopicRequest("submitOrder",submitOrder);
handleTopicRequest("postReview",postReview);
handleTopicRequest("registerCustomerEvent",registerCustomerEvent);
handleTopicRequest("followUser",followUser);
handleTopicRequest("getRestaurantOrders",getRestaurantOrders);
handleTopicRequest("getRestaurantDishes",getRestaurantDishes);
handleTopicRequest("getRestaurantEvents",getRestaurantEvents);
handleTopicRequest("getUpcomingEvents",getUpcomingEvents);
handleTopicRequest("getCustomerListEvent",getCustomerListEvent);
handleTopicRequest("getRegisteredEvents",getRegisteredEvents);
handleTopicRequest("getFollowing",getFollowing);
handleTopicRequest("getSearchEvents",getSearchEvents);
handleTopicRequest("getSearchRestaurants",getSearchRestaurants);
handleTopicRequest("getSearchUsers",getSearchUsers);
handleTopicRequest("getRestaurantReviews",getRestaurantReviews);
handleTopicRequest("getCustomerOrders",getCustomerOrders);
handleTopicRequest("getAllUsers",getAllUsers);
handleTopicRequest("updateOrderStatus",updateOrderStatus);