var app = require('./index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);

describe('Book App', function(){

    it('GET /restaurantProfile',function(done){
        agent.get('/restaurantProfile')
            .send({idRestaurants:2})
            .then(function(res){
                expect(res.status).to.equal(200);
                expect(res.body[0].Email).to.equal('tuki@tuli.com');
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it('POST /updateCustomerProfile',function(done){
        agent.post('/updateCustomerProfile')
            .send(   {
                "idCustomers": 16,
                "firstname": "naman",
                "lastname":"agrawal",
                "email": "naman.agrawal@sjsu.edu",
                "password": "nmn",
                "phone": 999999999,
                "about": null,
                "favourites": "",
                "dob": null,
                "city": null,
                "state": null,
                "country": "India",
                "nickname": null,
                "profilepicpath": null
            })
            .then(function(res){
                expect(res.status).to.equal(200);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });
    it('GET /getCustomerOrders',function(done){
        agent.get('/getCustomerOrders')
            .send({idCustomers:16})
            .then(function(res){
                expect(res.status).to.equal(200);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });
    it('POST /updateOrderStatus',function(done){
        agent.post('/updateOrderStatus')
            .send({
                "orderstatus":"delivered",
                "idOrders":1,
            })
            .then(function(res){
                expect(res.status).to.equal(200);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });
    it('GET /getRestaurantReviews',function(done){
        agent.get('/getRestaurantReviews')
            .send({idRestaurants:2})
            .then(function(res){
                expect(res.status).to.equal(200);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });


})