import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {setFirstname,setLastname,setEmail,setCountry} from "../../redux/slices/home";
//import store from "../../redux/store";
class Home extends Component {

  constructor(props) {

    super(props);

    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      country:"",
      profileUpdated:"",
      profile:"",
    };

    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.countryChangeHandler = this.countryChangeHandler.bind(this);
    this.submitUpdateProfile = this.submitUpdateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    
  }

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  //password change handler to update state variable with the text entered by the user
  countryChangeHandler = (e) => {
    this.setState({
      country: e.target.value,
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

  getProfile = (e) => {

    var data = {params:{idCustomers:+localStorage.getItem("c_id")}};
    axios.get("http://localhost:3001/customerProfile",data).then((response) => {
   //update the state with the response data
   console.log(response);
   this.setState({
     profile: (
       <div>
   <h3><label >Email ID : {response.data[0].Email}</label></h3>
   <h3><label >First Name : {response.data[0].LastName}</label></h3>
     <h3><label >LastName : {response.data[0].LastName}</label></h3>
   <h3><label >Country : {response.data[0].Country}</label></h3>
   </div>),
   });
});
}


  submitUpdateProfile = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      idCustomers:+localStorage.getItem("c_id"),
      email: this.state.email,
      country: this.state.country,
      firstname: this.state.firstname,
      lastname:this.state.lastname,
      password:+localStorage.getItem("c_pass"),
 
    };
    console.log('inside home',localStorage.getItem("c_pass"));
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    // this.props.signup(data);
    axios
      .post("http://localhost:3001/updateCustomerProfile", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.props.setCountry(this.state.country);
          this.props.setFirstname(this.state.firstname);
          this.props.setLastname(this.state.lastname);
          this.props.setEmail(this.state.email);
          this.setState({
            profile: ""});
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
              Email already Exists!
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




  
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.loginState.customerID) {
  //     var data = {params:{idCustomers:nextProps.loginState.customerID}};
  //     axios.get("http://localhost:3001/customerProfile",data).then((response) => {
  //       //update the state with the response data
  //       console.log(response);
  //       this.setState({
  //         "FirstName": response.data[0].FirstName,
  //         "LastName": response.data[0].LastName,
  //         "Email": response.data[0].Email,
  //         "Country": response.data[0].Country,
  //       })
        
  //     });
  //   }

  // }


  render() {
    //if not logged in go to login page
    let redirectVar = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
       
        </div>
        <Form  onSubmit={this.submitUpdateProfile} >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"  onChange={this.emailChangeHandler} />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" onChange={this.firstnameChangeHandler} />
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" onChange={this.lastnameChangeHandler} />
                </Form.Group>
                <Form.Group controlId="formBasicCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" placeholder="Country" onChange={this.countryChangeHandler} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update
                </Button>

            </Form>
            {this.state.profileUpdated}
            <Button  onClick={this.getProfile}>
                    View Profile
                </Button>
            {this.state.profile}
      </div>
    );
  }
}
//export Home Component
// const mapDispatchToProps = {setUsername,setAuthFlag,setCustomerID};
const mapDispatchToProps = {setFirstname,setLastname,setEmail,setCountry};
const mapStateToProps = state => {
  return {
    loginState: state.loginState
  }
};

//export Login Component
export default connect(mapStateToProps,mapDispatchToProps)(Home);

