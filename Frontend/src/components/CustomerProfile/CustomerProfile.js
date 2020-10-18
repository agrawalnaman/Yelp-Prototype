import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
class CustomerProfile extends Component {

    constructor(props) {

        super(props);

        this.state = {
            profileUpdated: "",
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            about: "",
            favourites: "",
            dob: "",
            city: "",
            state: "",
            country: "",
            nickname: "",
            phone: "",
        };

        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.aboutChangeHandler = this.aboutChangeHandler.bind(this);
        this.favouritesChangeHandler = this.favouritesChangeHandler.bind(this);
        this.dobChangeHandler = this.dobChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.nicknameChangeHandler = this.nicknameChangeHandler.bind(this);
        this.submitUpdateProfile = this.submitUpdateProfile.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.getProfile = this.getProfile.bind(this);

    }

    componentDidMount() {
        if (cookie.load("cookie")) {
        var data = { params: { idCustomers: +localStorage.getItem("c_id") } };
        console.log("c_id profile customer did mount", localStorage.getItem("c_id"));
        axios.get("http://localhost:3001/customerProfile", data).then((response) => {
            //update the state with the response data
            console.log("profile did mount:", response.data[0]);
            this.setState({
                profileUpdated: "",
                email: response.data[0].Email,
                phone: response.data[0].Phone,
                firstname: response.data[0].FirstName,
                lastname: response.data[0].LastName,
                about: response.data[0].About,
                favourites: response.data[0].Favourites,
                dob: response.data[0].DOB,
                city: response.data[0].City,
                state: response.data[0].State,
                country: response.data[0].Country,
                nickname: response.data[0].NickName,
            });
        });
    }
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
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value,
        });
    };
    aboutChangeHandler = (e) => {
        this.setState({
            about: e.target.value,
        });
    };
    favouritesChangeHandler = (e) => {
        this.setState({
            favourites: e.target.value,
        });
    };
    dobChangeHandler = (e) => {
        this.setState({
            dob: e.target.value,
        });
    };
    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value,
        });
    };
    stateChangeHandler = (e) => {
        this.setState({
            state: e.target.value,
        });
    };
    cityChangeHandler = (e) => {
        this.setState({
            city: e.target.value,
        });
    };
    nicknameChangeHandler = (e) => {
        this.setState({
            nickname: e.target.value,
        });
    };

    submitNewPassword = (e) => {
        var headers = new Headers();
        e.preventDefault();
        console.log("inside submit new password");
        const data = {
            password: this.state.password,
            idCustomers: +localStorage.getItem("c_id"),
        };
        axios.defaults.withCredentials = true;
        axios
            .post("http://localhost:3001/updateCustomerPassword", data)
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

    getProfile = (e) => {

        var data = { params: { idCustomers: +localStorage.getItem("c_id") } };
        axios.get("http://localhost:3001/customerProfile", data).then((response) => {
            //update the state with the response data
            console.log(response);
            this.setState({
                profile: (
                    <div>
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Click To View Your Profile
                                     </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>

                                        <p><label >Email ID : {response.data[0].Email}</label></p>
                                        <p><label >First Name : {response.data[0].FirstName}</label></p>
                                        <p><label >LastName : {response.data[0].LastName}</label></p>
                                        <p><label >Country : {response.data[0].Country}</label></p>
                                        <p><label >State : {response.data[0].State}</label></p>
                                        <p><label >City : {response.data[0].City}</label></p>
                                        <p><label >About : {response.data[0].About}</label></p>
                                        <p><label >Favourites : {response.data[0].Favourites}</label></p>
                                        <p><label >Date Of Birth : {response.data[0].DOB}</label></p>
                                        <p><label >Phone : {response.data[0].Phone}</label></p>
                                        <p><label >NickName : {response.data[0].NickName}</label></p>

                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>


                    </div>),
            });
        });
    };


    submitUpdateProfile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            idCustomers: +localStorage.getItem("c_id"),
            email: this.state.email,
            country: this.state.country,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            about: this.state.about,
            favourites: this.state.favourites,
            dob: this.state.dob,
            city: this.state.city,
            state: this.state.state,
            nickname: this.state.nickname,
            phone: this.state.phone,

        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/updateCustomerProfile", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        profileUpdated: (
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




    render() {
        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        return (
            <div class="row">

                <div class="col">
                    <Form onSubmit={this.submitUpdateProfile} >
                        <Form.Row>
                            <Form.Group controlId="formBasicEmail" >
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler} defaultValue={this.state.email} required/>
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                    </Form.Text>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId="formBasicFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" placeholder="First Name" onChange={this.firstnameChangeHandler} defaultValue={this.state.firstname} required/>
                            </Form.Group>

                            <Form.Group controlId="formBasicLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" placeholder="Last Name" onChange={this.lastnameChangeHandler} defaultValue={this.state.lastname} required />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId="formBasicCountry">
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" placeholder="Country" onChange={this.countryChangeHandler} defaultValue={this.state.country} />
                            </Form.Group>
                            <Form.Group controlId="formBasicState">
                                <Form.Label>State</Form.Label>
                                <Form.Control type="text" placeholder="State" onChange={this.stateChangeHandler} defaultValue={this.state.state} />
                            </Form.Group>
                            <Form.Group controlId="formBasicCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" placeholder="City" onChange={this.cityChangeHandler} defaultValue={this.state.city} />
                            </Form.Group> </Form.Row>
                        <Form.Row>
                            <Form.Group controlId="formBasicAbout">
                                <Form.Label>About</Form.Label>
                                <Form.Control type="text" placeholder="About" onChange={this.aboutChangeHandler} defaultValue={this.state.about} />
                            </Form.Group>
                            <Form.Group controlId="formBasicFavourites">
                                <Form.Label>Favourites</Form.Label>
                                <Form.Control type="text" placeholder="Favourites" onChange={this.favouritesChangeHandler} defaultValue={this.state.favourites} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId="formBasicDOB">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" placeholder="Date Of Birth" onChange={this.dobChangeHandler} defaultValue={this.state.dob} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="tel" placeholder="Phone" onChange={this.phoneChangeHandler} defaultValue={this.state.phone} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
                            </Form.Group>
                            <Form.Group controlId="formBasicNickName">
                                <Form.Label>NickName</Form.Label>
                                <Form.Control type="text" placeholder="NickName" onChange={this.nicknameChangeHandler} defaultValue={this.state.nickname} />
                            </Form.Group>
                        </Form.Row>

                        <Button variant="danger" type="submit">
                            Update
                </Button>
                    </Form>

                    {this.state.profileUpdated}


                </div>
                <div class="col">
                    {redirectVar}
                    {this.state.profile}
                    <Button onClick={this.getProfile}>
                        Get Updated Profile
                </Button>
                </div>


                <div class="col">
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
                                        <Form.Group controlId="formBasicEmail" >
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required/>
                                        </Form.Group>
                                        <Button variant="danger" type="submit">
                                            Update Password
                                </Button>
                                    </Form>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>

            </div>
        );
    }
}


export default CustomerProfile;