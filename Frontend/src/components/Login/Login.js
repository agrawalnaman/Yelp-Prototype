import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { setUsername, setAuthFlag, setCustomerID } from "../../redux/slices/login";
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
//Define a Login Component
class Login extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      password: "",
      authFlag: false,
      invalidCredentials: "",
      idCustomers: "",
      persona: "",

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
        .post("http://localhost:3001/customerLogin", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log(response.data);
          if (response.status === 200) {

            localStorage.setItem("c_id", response.data.idCustomers);
            localStorage.setItem("persona", this.state.persona);                                               
            this.setState({
              authFlag: true,
            });
            console.log(response.data.idCustomers);
            this.setState({
              idCustomers: response.data.idCustomers,
            });
            console.log(response.data.password);

            this.props.setCustomerID(response.data.idCustomers);
            this.props.setUsername(this.state.username);
            this.props.setAuthFlag(true);
            window.location.reload();

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
          console.log("success" + this.state.authFlag);
        })
        .catch((e) => {
          debugger;
          console.log("FAIL!!!");
        });
    }
    else {
      //make a post request with the user data
      axios
        .post("http://localhost:3001/restaurantLogin", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log(response.data);
          if (response.status === 200) {
            console.log("login r_id:", response.data.idRestaurants);
            localStorage.setItem("r_id", response.data.idRestaurants);
            localStorage.setItem("persona", this.state.persona);
            this.setState({
              authFlag: true,
            });
            window.location.reload();


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
    console.log("cookie", cookie.load("cookie"));
    if (cookie.load("cookie") === "customer-admin") {
      
      redirectVar = <Redirect to="/CustomerMain" />;
    }
    else if (cookie.load("cookie") === "restaurant-admin") {
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

const mapDispatchToProps = { setUsername, setAuthFlag, setCustomerID };

//export Login Component
export default connect(null, mapDispatchToProps)(Login);

