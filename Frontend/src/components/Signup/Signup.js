import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap';
//Define a Login Component
class Signup extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      idCreated: "",
      restaurantname:"",
      location:"",

    };
    //Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.restaurantnameChangeHandler = this.restaurantnameChangeHandler.bind(this);
    this.locationChangeHandler = this.locationChangeHandler.bind(this);
    this.submitCustomerSignup = this.submitCustomerSignup.bind(this);
    this.submitRestaurantSignup = this.submitRestaurantSignup.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  //   componentWillMount() {
  //     this.setState({
  //       authFlag: false,
  //     });
  //   }
  restaurantnameChangeHandler = (e) => {
    this.setState({
      restaurantname: e.target.value,
    });
  };
  locationChangeHandler = (e) => {
    this.setState({
      location: e.target.value,
    });
  };
  //username change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  firstnameChangeHandler = (e) => {
    this.setState({
      firstname: e.target.value,
    });
  };
  lastnameChangeHandler = (e) => {
    this.setState({
      lastname: e.target.value,
    });
  };
  //submit Login handler to send a request to the node backend
  submitCustomerSignup = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstname,
      lastName: this.state.lastname,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    // this.props.signup(data);
    axios
      .post("http://localhost:3001/customerSignUp", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            idCreated: (
              <h3>
                Account Created
              </h3>
            ),
          });

        } else {
          this.setState({
            idCreated: (
              <h3>
                Email Id already registered!
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



  submitRestaurantSignup = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
      restaurantname: this.state.restaurantname,
      location: this.state.location,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    // this.props.signup(data);
    axios
      .post("http://localhost:3001/restaurantSignUp", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            idCreated: (
              <h3>
                Account Created
              </h3>
            ),
          });

        } else {
          this.setState({
            idCreated: (
              <h3>
                Email Id already registered!
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
    //redirect based on successful login
    let redirectVar = null;
    // let invalidCredentials = null;
    if (cookie.load("cookie")) {
      redirectVar = <Redirect to="/home" />;
    }

    return (
      <div>
        { redirectVar}
        <div class="container">
          <div class="signup-form">
            {this.state.idCreated}
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Customer SignUp
                                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form onSubmit={this.submitCustomerSignup} >
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler} required/>
                        <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                    </Form.Text>
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required />
                      </Form.Group>
                      <Form.Group controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" onChange={this.firstnameChangeHandler} required />
                      </Form.Group>
                      <Form.Group controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" onChange={this.lastnameChangeHandler}  required/>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Submit
                </Button>
                    </Form>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Restaurant SignUp
                                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form onSubmit={this.submitRestaurantSignup} >
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler} required />
                        <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                    </Form.Text>
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required />
                      </Form.Group>
                      <Form.Group controlId="formBasicRestaurantName">
                        <Form.Label>Restaurant Name</Form.Label>
                        <Form.Control type="text" placeholder="Restaurant Name" onChange={this.restaurantnameChangeHandler} required/>
                      </Form.Group>
                      <Form.Group controlId="formBasicLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" placeholder="Location" onChange={this.locationChangeHandler} required/>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Submit
                </Button>
                    </Form>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

          </div>
        </div>
      </div>
    );
  }
}
//export Login Component
export default Signup;
