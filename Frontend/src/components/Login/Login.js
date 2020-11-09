import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { setUsername, setAuthFlag, setCustomerID, setPersona } from "../../redux/slices/login";
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import jwt_decode from "jwt-decode";

//const jwt_decode = require('jwt-decode');
//Define a Login Component
class Login extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      token: "",
      username: "",
      password: "",
      authFlag: false,
      invalidCredentials: "",
      idCustomers: "",
      persona: "",
      idRestaurants:""

    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.personaChangeHandler = this.personaChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
      persona: "",
    });
  }
  personaChangeHandler = (e) => {
    this.setState({
      persona: e,
    });
    console.log(e);
  };
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  //submit Login handler to send a request to the node backend
  submitLogin = (e) => {

    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.username,
      password: this.state.password,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    if (this.state.persona === "Customer") {
      //make a post request with the user data
      axios
        .post("http://35.163.78.149:3001/customerLogin", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log(response.data);
          if (response.status === 200) {
            this.setState({
              token: response.data,
              authFlag: true
            });
            console.log("length", this.state.token.length);
            if (this.state.token.length > 0) {
              localStorage.setItem("token", this.state.token);

              var decoded = jwt_decode(this.state.token.split(' ')[1]);
              console.log("decoded:", decoded);
              localStorage.setItem("c_id", decoded._id);
              localStorage.setItem("persona", this.state.persona);
              this.props.setPersona(this.state.persona);
              // console.log(response.data.idCustomers);
              this.setState({
                idCustomers: decoded._id,
              });
              //   console.log(response.data.password);

              this.props.setCustomerID(decoded._id);
              this.props.setUsername(this.state.username);
              this.props.setAuthFlag(true);
              //  window.location.reload();
            }

          } else {
            this.setState({
              authFlag: false,
            });
            this.setState({
              invalidCredentials: (
                <p>
                  Your login credentials could not be verified, please try again.
                </p>
              ),
            });
          }
          console.log("success:" + this.state.authFlag);
        })
        .catch((e) => {
          debugger;
          console.log("FAIL!!!");
        });
    }
    else {
      //make a post request with the user data
      axios
        .post("http://35.163.78.149:3001/restaurantLogin", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log(response.data);
          if (response.status === 200) {
            this.setState({
              token: response.data,
              authFlag: true
            });
            if (this.state.token.length > 0) {
              localStorage.setItem("token", this.state.token);

              var decoded = jwt_decode(this.state.token.split(' ')[1]);
              console.log("decoded:", decoded);
              localStorage.setItem("r_id", decoded._id);
            //console.log("login r_id:", response.data.idRestaurants);
           // localStorage.setItem("r_id", response.data.idRestaurants);
            localStorage.setItem("persona", this.state.persona);
            this.props.setPersona(this.state.persona);
            this.setState({
              idRestaurants: decoded._id,
            });
            //    window.location.reload();
            this.props.setCustomerID(decoded._id);
            this.props.setUsername(this.state.username);
            this.props.setAuthFlag(true);
          }


          } else {
            console.log("Elseseeeee");
            this.setState({
              authFlag: false,
            });
            this.setState({
              invalidCredentials: (
                <p>
                  Your login credentials could not be verified, please try again.
                </p>
              ),
            });
          }
          console.log("success" + this.state.authFlag);
        })
        .catch((e) => {
          debugger;
          console.log("FAIL!!!");
        });

    }
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    let invalidCredentials = null;
    console.log("local storage", localStorage.getItem("persona"));
    if (this.state.token.length > 0 &&  localStorage.getItem("persona")==="Customer") {

      redirectVar = <Redirect to="/CustomerMain" />;
    }
    else if (this.state.token.length > 0 &&  localStorage.getItem("persona")==="Restaurant") {
      redirectVar = <Redirect to="/RestaurantMain" />;
    }

    return (
      <div>
        {redirectVar}
        <div class="container">

          <div class="login-form">
            <form onSubmit={this.submitLogin}>
              <ToggleButtonGroup type="radio" name="options" onChange={this.personaChangeHandler} >
                <ToggleButton value={"Customer"}>Customer </ToggleButton>
                <ToggleButton value={"Restaurant"}>Restaurant </ToggleButton>
              </ToggleButtonGroup>
              <div class="main-div">
                <div class="panel">

                  <h2>Login</h2>
                  <p>Please enter your username and password</p>
                </div>
                <div class="form-group">
                  <input
                    onChange={this.usernameChangeHandler}
                    type="text"
                    class="form-control"
                    name="username"
                    placeholder="Username"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    onChange={this.passwordChangeHandler}
                    type="password"
                    class="form-control"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary">
                  Login
              </button>
              </div>
              {this.state.invalidCredentials}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { setUsername, setAuthFlag, setCustomerID, setPersona };

//export Login Component
export default connect(null, mapDispatchToProps)(Login);

