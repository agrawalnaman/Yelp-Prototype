import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
class CustomerProfileModular extends Component {

    constructor(props) {

        super(props);

        this.state = {
            profile: "",
        };



    }

    componentDidMount() {
        var data = { params: { idCustomers: this.props.location.state} };
        if (cookie.load("cookie")) {
        axios.get("http://localhost:3001/customerProfile", data).then((response) => {
            //update the state with the response data
            console.log("profile did mount:", response.data[0]);
            this.setState({
                profile:(            <Card>
                    <Card.Header>
                       
                    </Card.Header>
            
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
                </Card>),

            });

        });
    }
    }


    render() {
        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        return (
            <div>
                {redirectVar}
                {this.state.profile}
            </div>
        );
    }
}


export default CustomerProfileModular;