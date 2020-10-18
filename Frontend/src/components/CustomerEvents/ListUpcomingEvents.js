import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

//Define a Login Component
class ListUpcomingEvents extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            event: "",
            name: "",
            eventnotfound: "",
        };
    }



    componentDidMount() {
        var headers = new Headers();
        //prevent page from refresh
      
        console.log("name of event:", this.state.name);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .get("http://localhost:3001/getUpcomingEvents")
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        event: response.data,
                    });
                    console.log(this.state.event);

                } else {
                    this.setState({
                        event: "",
                        eventnotfound: "No Event of this Name Found!",
                    });
                }
            })

    }


    render() {
        //redirect based on successful login
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        const data = this.state.event;
        return (
            <div>
                {redirectVar}
                {this.state.eventnotfound}
                <CardColumns>
                    {data !== "" ? data.map((d) => {
                        return (
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Card.Header as="h5"> Event Name : {d.EventName}</Card.Header>
                                        <Card.Header as="h5"> Restaurant : {d.Name}</Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Click To View Event Details
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <Card.Title>{d.Location}</Card.Title>
                                            <Card.Text>
                                                Date : {d.Date}
                                            </Card.Text>
                                            <Card.Text>
                                                Time : {d.Time}
                                            </Card.Text>
                                            <Card.Text>
                                                Description : {d.Description}
                                            </Card.Text>
                                            <Card.Text>
                                                Hashtags : {d.Hashtags}
                                            </Card.Text>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        )
                    }) : ""}
                </CardColumns>
            </div>
        );
    }
}


export default ListUpcomingEvents;