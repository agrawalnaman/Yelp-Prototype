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
import { setUpcomingevents } from '../../redux/slices/upcomingevents';
import { connect } from "react-redux";
var _ = require('lodash');

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
            sort:false
        };
    }



    componentDidMount() {
        var headers = new Headers();
        //prevent page from refresh
      
        console.log("name of event:", this.state.name);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

        //make a post request with the user data
        // this.props.signup(data);
        axios
            .get("http://34.220.156.227:3001/getUpcomingEvents")
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    this.setState({
                       // event: response.data,
                    });
                  //  console.log(this.state.event);
                    this.props.setUpcomingevents(response.data);

                } else {
                    this.setState({
                        event: "",
                        eventnotfound: "No Event of this Name Found!",
                    });
                }
            })

    }

    sortByDate = (e) => {
        this.setState({
            sort:!this.state.sort
        });

    };

    render() {
        //redirect based on successful login
        let redirectVar = null;
        let invalidCredentials = null;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />;
        }
       // const data = this.state.event;
       const data = this.state.sort ? _.orderBy(this.props.upcomingevents, ['Date'], ['desc']) : this.props.upcomingevents;
       console.log("zzzzzzz",data);
        return (
            <div>
                {redirectVar}
                <Button onClick={this.sortByDate}>
                        Sort By Date
                </Button>
                {this.state.eventnotfound}
                <CardColumns>
                    {data !== "" && data !== undefined ? data.map((d) => {
                        return (
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Card.Header as="h5"> Event Name : {d.EventName}</Card.Header>
                                        <Card.Header as="h5"> Restaurant : {d.restaurantevent[0].Name}</Card.Header>
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

const mapStateToProps = (state) => ({
    upcomingevents : state.upcomingeventsState.upcomingevents,
})

const mapDispatchToProps = { setUpcomingevents };

export default connect(mapStateToProps, mapDispatchToProps)(ListUpcomingEvents);