import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { Link } from "react-router-dom";
import MapContainer from "../CustomerMain/MapRestaurants";
import { RadioGroup, RadioButton} from 'react-radio-buttons';

//Define a Login Component
class CustomerMain extends Component {
    //call the constructor method
    constructor(props) {
      

        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            searchterm: "",
            category: "",
            restaurants: "",
            restaurantnotfound: "",
            filteredrestaurants : "",
        };
        this.searchHandler = this.searchHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.onChange = this.onChange.bind(this);
    }



    componentDidMount() {
 
       
        this.setState({
            searchterm: "",
            category: "",
            restaurants: "",
            restaurantnotfound: "",
            filteredrestaurants :"",

        });

       
    }
    searchHandler = (e) => {
        this.setState({
            searchterm: e.target.value,

        });
    };
    onChange = (e) => {
        // this.state.restaurants!== null ? filteredrestaurants = this.state.restaurants.filter(
        //         (restaurant) => restaurant.deliveryMode === e.target.value
        //     ) : "";
        var filter1="";
        console.log(e);
        console.log("filter",this.state.restaurants)
        if(this.state.restaurants!=="")
        {
        filter1 = this.state.restaurants.filter(function (d) {
            return d.deliveryMode === e;
        });
        this.setState({
            filteredrestaurants:filter1,

        });
    }

    };
    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value,
        });
    };

    submitSearchEvent = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            params: {
                searchterm: this.state.searchterm,
                category: this.state.category,

            }
        };
        console.log("search term:", this.state.searchterm);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .get("http://localhost:3001/getSearchRestaurants", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        restaurants: response.data,
                        filteredrestaurants:response.data,
                    });
                    console.log(this.state.restaurants);

                } else {
                    this.setState({
                        restaurants: "",
                        filteredrestaurants:"",
                        restaurantnotfound: "No Restuarant Found!",
                    });
                }
            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });
    };


    render() {
        //redirect based on successful login
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        const data = this.state.filteredrestaurants;
        return (
            <div class="row">
                {redirectVar}
                <div class="col">
                    <Form onSubmit={this.submitSearchEvent}>
                        <Form.Group controlId="formBasicEventName">
                            <Form.Label>Input Search Term</Form.Label>
                            <Form.Control type="text" placeholder="search term" onChange={this.searchHandler} required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Search Category</Form.Label>
                            <Form.Control as="select" onChange={this.categoryChangeHandler} defaultValue="dishes">
                                <option value="location">Location</option>
                                <option value="cuisine">Cuisine</option>
                                <option value="deliveryMode">Mode of Delivery</option>
                                <option value="dishes">Dishes</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Search Restaurant
                    </Button>
                    </Form>
                    <RadioGroup onChange={this.onChange} horizontal>
                        <RadioButton value="pickup" rootColor="#de3933" pointColor="#0c0d0c">
                            PickUp
                         </RadioButton>
                        <RadioButton value="dinein" rootColor="#de3933" pointColor="#0c0d0c">
                            Dine In
                         </RadioButton>
                        <RadioButton value="delivery" rootColor="#de3933" pointColor="#0c0d0c">
                            Yelp Delivery
                        </RadioButton>
                    </RadioGroup>

                    {this.state.restaurantnotfound}

                    <CardColumns>
                        {data !== "" ? data.map((d) => {
                            return (
                                <Accordion>
                                    <Card>
                                        <Card.Header>
                                            <Card.Header as="h5"> Restaurant Name : {d.Name}</Card.Header>
                                            <Card.Header as="h5"> Cuisine : {d.Cuisine}</Card.Header>
                                            <Link to={{
                                                pathname: "/RestaurantPage",
                                                state: d.idRestaurants,
                                            }}>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Take me to Restaurant's Page!
                                    </Accordion.Toggle>
                                            </Link>
                                        </Card.Header>
                                    </Card>
                                </Accordion>

                            )
                        }) : ""}


                    </CardColumns>
                </div>
                <div class="col-7">
                    <div class="media">
                        <div class="media-body">
                            <h5 class="mt-0">Restaurants MAP</h5>
                            <MapContainer />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


export default CustomerMain;