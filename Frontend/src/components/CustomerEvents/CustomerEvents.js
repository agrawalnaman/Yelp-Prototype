import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import ListUpcomingEvents from "../CustomerEvents/ListUpcomingEvents";
import RegisteredEvents from "../CustomerEvents/RegisteredEvents";
import SearchEvents from "../CustomerEvents/SearchEvents";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Col';
import Button from "react-bootstrap/esm/Button";

//Define a Login Component
class CustomerEvents extends Component {
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
                <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
                    <div className="row" >
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column" >
                                <Nav.Item >
                                    <Nav.Link eventKey="ListUpcomingEvents" >List of Upcoming Events</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="SearchEvents">Search Events</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="RegisteredEvents">Registered Events</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="ListUpcomingEvents">
                                    <ListUpcomingEvents/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="SearchEvents">
                                    <SearchEvents/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="RegisteredEvents">
                                    <RegisteredEvents/>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </div>
                </Tab.Container>
            </div>
        );
    }
}


export default CustomerEvents;