import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import RestaurantProfile from "../RestaurantMain/RestaurantProfile";
import Dishes from "../RestaurantMain/Dishes";
import Reviews from "../RestaurantMain/Reviews";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Col';
import Button from "react-bootstrap/esm/Button";


//Define a Login Component
class RestaurantMain extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }

        return (
            <div>
                {redirectVar}
                <Tab.Container id="left-tabs-example" defaultActiveKey="RestaurantProfile" >
                    <div className="row" >
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column" >
                                <Nav.Item >
                                    <Nav.Link eventKey="RestaurantProfile" >Profile</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Dishes">Dishes</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Reviews">Reviews</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="RestaurantProfile">
                                    <RestaurantProfile/>
                                   
                                </Tab.Pane>
                                <Tab.Pane eventKey="Dishes">
                                    <Dishes/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Reviews">
                                    <Reviews/>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </div>
                </Tab.Container>
            </div>
        );
    }
}


export default RestaurantMain;