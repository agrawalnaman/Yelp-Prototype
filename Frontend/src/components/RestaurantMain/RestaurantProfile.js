import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
//Define a Login Component
class RestaurantProfile extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email:"",
            name:"",
            password:"",
            location:"",
            description:"",
            contact:"",
            timings:"",
            reviews:"",

        };
    }

    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        console.log("r_id profile resturant did mount",localStorage.getItem("r_id")); 
        if (cookie.load("cookie")) {
        axios.get("http://localhost:3001/restaurantProfile", data).then((response) => {
            //update the state with the response data
            console.log("profile did mount:",response.data[0]);
            this.setState({
                profileUpdated:"",
                email:response.data[0].Email,
                name: response.data[0].Name,
                location:response.data[0].Location,
                description:response.data[0].Description,
                contact:response.data[0].Contact,
                timings:response.data[0].Timings,
            });
        });
    }
    }
    emailChangeHandler = (e) => {
        this.setState({
          email : e.target.value,
        });
    };
    nameChangeHandler = (e) => {
        this.setState({
          name : e.target.value,
        });
    };
    locationChangeHandler = (e) => {
        this.setState({
          location : e.target.value,
        });
    };
    descriptionChangeHandler = (e) => {
        this.setState({
          description : e.target.value,
        });
    };
    timingsChangeHandler = (e) => {
        this.setState({
          timings : e.target.value,
        });
    };
    contactChangeHandler = (e) => {
        this.setState({
          contact : e.target.value,
        });
    };
    passwordChangeHandler = (e) => {
        this.setState({
          password : e.target.value,
        });
    };


    submitNewPassword = (e) => {
      var headers = new Headers();
      e.preventDefault();
      console.log("inside submit new password restaurant");
      const data = {
          password: this.state.password,
          idRestaurants: +localStorage.getItem("r_id"),
      };
      axios.defaults.withCredentials = true;
      axios
          .post("http://localhost:3001/updateRestaurantPassword", data)
          .then((response) => {
              console.log("Status Code : ", response);
              if (response.status === 200) {
                  console.log("password call status:", response.status);
                   window.alert("Password Changed");

              } else {
                  console.log("password call status else:", response.status);
                  window.alert("Unable to Change Password");

              }
          }) .catch((e) => {
              debugger;
              console.log("FAIL!!!");
          });
  };

    submitUpdateProfile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
          idRestaurants:+localStorage.getItem("r_id"),
          email: this.state.email,
          location: this.state.location,
          name: this.state.name,
          password:this.state.password,
          description:this.state.description,
          timings:this.state.timings,
          contact:this.state.contact,
     
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
          .post("http://localhost:3001/updateRestaurantProfile", data)
          .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                this.setState({
                profileUpdated:(
                    <h3>
                        Profile Updated
                    </h3>
                ),
                });
               
             
            } else {
              this.setState({
                profileUpdated: (
                  <h3>
                    Email already exists! use your own ID please!
                  </h3>
                ),
              });
           
            }
          })
          .catch((e) => {
            debugger;
            console.log("FAIL!!!");
          });
      };
    
 
    render() {
 

        return (
            <div>
             
                <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Change Password
                                     </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Form onSubmit={this.submitNewPassword} >
                                        <Form.Group controlId="formBasicPassword" >
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required />
                                        </Form.Group>
                                        <Button variant="danger" type="submit">
                                            Update Password
                                </Button>
                                    </Form>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
            <Form onSubmit={this.submitUpdateProfile} >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={this.emailChangeHandler} defaultValue={this.state.email} required/>
                </Form.Group>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control type="text" placeholder="Name" onChange={this.nameChangeHandler} defaultValue={this.state.name} required />
                </Form.Group>
                <Form.Group controlId="formLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" placeholder="Location" onChange={this.locationChangeHandler} defaultValue={this.state.location} required/>
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Description" onChange={this.descriptionChangeHandler} defaultValue={this.state.description} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Timings</Form.Label>
                    <Form.Control type="text" placeholder="Timings" onChange={this.timingsChangeHandler} defaultValue={this.state.timings} />
                </Form.Group>
                <Form.Group controlId="formContact">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control type="text" placeholder="Contact" onChange={this.contactChangeHandler} defaultValue={this.state.contact} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update
            </Button>
            {this.state.profileUpdated}
            </Form>
            </div>
        );

    }
}

export default RestaurantProfile;