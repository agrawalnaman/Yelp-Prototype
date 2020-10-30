import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/esm/Button";

class CustomerProfileModular extends Component {

    constructor(props) {

        super(props);

        this.state = {
            profile: "",
            follow:false,
            customerID:"",
        };



    }

    componentDidMount() {
        var data = { params: { idCustomers: this.props.location.state} };
        if (cookie.load("cookie")) {
        axios.get("http://localhost:3001/customerProfile", data).then((response) => {
            //update the state with the response data
            console.log("profile did mount:", response.data);
            this.setState({
                profile:(            <Card>
                    <Card.Header>
                       
                    </Card.Header>
            
                        <Card.Body>
        
                            <p><label >Email ID : {response.data.Email}</label></p>
                            <p><label >First Name : {response.data.FirstName}</label></p>
                            <p><label >LastName : {response.data.LastName}</label></p>
                            <p><label >Country : {response.data.Country}</label></p>
                            <p><label >State : {response.data.State}</label></p>
                            <p><label >City : {response.data.City}</label></p>
                            <p><label >About : {response.data.About}</label></p>
                            <p><label >Favourites : {response.data.Favourites}</label></p>
                            <p><label >Date Of Birth : {response.data.DOB}</label></p>
                            <p><label >Phone : {response.data.Phone}</label></p>
                            <p><label >NickName : {response.data.NickName}</label></p>
        
                        </Card.Body>
                </Card>),
                customerID:response.data._id,

            });

        });
    }
    };

    follow = () => {
        var headers = new Headers();
        //prevent page from refresh
        const data = {
            idCustomers:localStorage.getItem("c_id"),
            idToFollow: this.state.customerID,
         };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/followUser", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        follow: true
                    });

                } else {
                    window.alert("Already Following");
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
            <div>
                
                {redirectVar}
                {this.state.follow===false ?<Button variant="primary" onClick={() => this.follow()}>Follow</Button>:<Button disabled>Following</Button>}
                
                {this.state.profile}
            </div>
        );
    }
}


export default CustomerProfileModular;