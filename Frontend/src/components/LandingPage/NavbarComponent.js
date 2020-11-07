import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { setUsername, setAuthFlag, setCustomerID,setPersona } from "../../redux/slices/login";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

//create the Navbar Component
class NavbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
     persona:localStorage.getItem("persona"),
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  //handle logout to destroy the cookie
  handleLogout = () => {
    //cookie.remove("cookie", { path: "/" });
    this.props.setCustomerID("");
    this.props.setUsername("");
    this.props.setAuthFlag(false);
    this.props.setPersona(null);
    localStorage.removeItem("c_id");
    localStorage.removeItem("r_id");
    localStorage.removeItem("persona");
    localStorage.removeItem("token");
    this.setState({
      persona:null,
  });
   // window.location.reload(false);

  };
  render() {
    console.log("=========================" + localStorage.getItem("persona"));
    //if Cookie is set render Logout Button
    let navLogin = null;

    if (localStorage.getItem("token")) {
      console.log("Able to read token");
      navLogin = (
        <ul class="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span class="glyphicon glyphicon-user"></span>Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      //Else display login button
      console.log("Not Able to read token");
      navLogin = (
        <ul class="nav navbar-nav navbar-right">

          <li>
            <Link to="/signup" className="mr-3">
              <span class="glyphicon"></span> Signup
            </Link>
          </li>
          <li>
            <Link to="/login" >
              <span class="glyphicon glyphicon-log-in"></span> Login
            </Link>
          </li>
        </ul>
      );

    }

    let restaurantNavbar = (
      <div class="row" >
        <div class="navbar-brand col-sm">
          <Link to="/RestaurantMain">
            <span class="glyphicon glyphicon-log-in"></span>DashBoard
            </Link></div>
        <div class="navbar-brand col-sm">
          <Link to="/RestaurantOrders">
            <span class="glyphicon glyphicon-log-in"></span>Orders
            </Link></div>
        <div class="navbar-brand col-sm">
          <Link to="/RestaurantEvents">
            <span class="glyphicon glyphicon-log-in"></span>Events
            </Link>
        </div>
      </div>
    );
    let customerNavbar = (
      <div class="row">
        <div class="navbar-brand col-sm"><Link to="/CustomerProfile">
          <span class="glyphicon glyphicon-log-in"></span>Profile
            </Link></div>
        <div class="navbar-brand col-sm"><Link to="/CustomerMain">
          <span class="glyphicon glyphicon-log-in"></span>DashBoard
            </Link></div>
            <div class="navbar-brand col-sm"><Link to="/CustomerOrders">
            <span class="glyphicon glyphicon-log-in"></span>Orders
            </Link></div>
            <div class="navbar-brand col-sm">
          <Link to="/CustomerEvents">
            <span class="glyphicon glyphicon-log-in"></span>Events
            </Link> </div>
            <div class="navbar-brand col-sm"><Link to="/CustomerUsers">
          <span class="glyphicon glyphicon-log-in"></span>Users
            </Link></div>
       
       
      </div>
    );
    let redirectVar = null;
    return (
      <div>
        {redirectVar}
        <Navbar>
          <Navbar.Brand href="">
            <h1 class="homepage-hero_logo" id="logo">
               <img src="https://s3-media0.fl.yelpcdn.com/assets/public/default.yji-a536dc4612adf182807e56e390709483.png" alt="YELP" />
            </h1>
          </Navbar.Brand>
          {/* <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
          </Nav> */}

          {/* <Navbar.Toggle /> */}
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {navLogin}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Navbar.Collapse >
              <Navbar.Text>
                {console.log("@@@@@@@@###",this.state.persona)}
                {console.log("$$$$$$$$",this.props.persona)}
                {this.props.persona || this.state.persona!== null ? this.props.persona  === "Restaurant" || this.state.persona === "Restaurant" ? restaurantNavbar : customerNavbar : ""}
              </Navbar.Text>
            </Navbar.Collapse>
          </Nav>
        </Navbar>

      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  persona : state.loginState.persona,
})

const mapDispatchToProps = { setUsername, setAuthFlag, setCustomerID,setPersona };

//export Navbar Component
export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);
