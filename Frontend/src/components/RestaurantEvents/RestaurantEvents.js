import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';
import { setEvents } from '../../redux/slices/events';
import { connect } from "react-redux";


//Define a Login Component
class RestaurantEvents extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            events: "",
            addEventModal: false,
            name: "",
            description: "",
            time: "",
            date: "",
            location: "",
            hashtags: "",
            customerListModal: "",
            customerListEventID: "",
            currentPage: 1,
            itemsPerPage: 3,
            customerList: [],
        };
        this.addEventHandler = this.addEventHandler.bind(this);
        this.nameHandler = this.nameHandler.bind(this);
        this.customerListHandler = this.customerListHandler.bind(this);
        this.descriptionHandler = this.descriptionHandler.bind(this);
        this.timeHandler = this.timeHandler.bind(this);
        this.dateHandler = this.dateHandler.bind(this);
        this.locationHandler = this.locationHandler.bind(this);
        this.hashtagsHandler = this.hashtagsHandler.bind(this);
        this.submitAddEvent = this.submitAddEvent.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }
    addEventHandler = (e) => {
        this.setState({
            addEventModal: true,

        });
    };

    nameHandler = (e) => {
        this.setState({
            name: e.target.value,

        });
    };

    descriptionHandler = (e) => {
        this.setState({
            description: e.target.value,

        });
    };

    timeHandler = (e) => {
        this.setState({
            time: e.target.value,

        });
    };
    dateHandler = (e) => {
        this.setState({
            date: e.target.value,
        });
    };
    locationHandler = (e) => {
        this.setState({
            location: e.target.value,
        });
    };

    hashtagsHandler = (e) => {
        this.setState({
            hashtags: e.target.value,
        });
    };
    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id),
        });
    };
    componentDidMount() {
        var data = { params: { idRestaurants: localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantEvents", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                addEventModal: false,
                name: "",
                description: "",
                time: "",
                date: "",
                location: "",
                hashtags: "",
                customerListModal: "",
                customerListEventID: "",
                customerList: [],
            });
            this.props.setEvents(response.data);
        });


    }




    submitAddEvent = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            idRestaurants: localStorage.getItem("r_id"),
            name: this.state.name,
            description: this.state.description,
            time: this.state.time,
            date: this.state.date,
            location: this.state.location,
            hashtags: this.state.hashtags,

        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/restaurantAddNewEvent", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Event Added");
                    var data1 = { params: { idRestaurants: localStorage.getItem("r_id") } };
                    axios.get("http://localhost:3001/getRestaurantEvents", data1).then((response) => {
                        //update the state with the response data
                        console.log(response.data);
                        this.setState({
                            addEventModal: false,
                            name: "",
                            description: "",
                            time: "",
                            date: "",
                            location: "",
                            hashtags: "",
                            customerListModal: "",
                            customerListEventID: "",
                            customerList: [],
                        });
                        this.props.setEvents(response.data);
                    });
                } else {
                    window.alert("unable Add Event");

                }
            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });


    };


    customerListHandler = (d) => {


        var data = { params: { idEvents: d._id } };
        axios.get("http://localhost:3001/getCustomerListEvent", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                customerList: response.data.customerevent,
            });
        });
        console.log(this.state.customerList);
        this.setState({
            customerListModal: true,
            customerListEventID: d._id,
        });

    };


    render() {
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        let addEvent = (
            <Modal show={this.state.addEventModal} onHide={() => this.setState({ addEventModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new Event!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitAddEvent} >
                        <Form.Group controlId="formName">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.nameHandler} required />
                        </Form.Group>
                        <Form.Group controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Description" onChange={this.descriptionHandler} required />
                        </Form.Group>
                        <Form.Group controlId="FormTime">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="time" placeholder="Time" onChange={this.timeHandler} required />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" placeholder="Date" onChange={this.dateHandler} required />
                        </Form.Group>
                        <Form.Group controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Location" onChange={this.locationHandler} required />
                        </Form.Group>
                        <Form.Group controlId="formHashTag">
                            <Form.Label>Hashtags</Form.Label>
                            <Form.Control type="text" placeholder="Hashtags" onChange={this.hashtagsHandler} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ addEventModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        let listCustomer = (
            <Modal show={this.state.customerListModal} onHide={() => this.setState({ customerListModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Customer List</Modal.Title>
                </Modal.Header>
                {this.state.customerList !== undefined && this.state.customerList.length !== 0 ? this.state.customerList.map((d) => {

                    return (
                        <Link to={{
                            pathname: "/CustomerProfileModular",
                            state: d._id,
                        }}>
                            {d.FirstName} {d.LastName}
                        </Link>
                    )
                }) : "No Registrations Yet"}

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ customerListModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );



        const data = this.props.events;
        console.log("data:", data);
        const currentPage = this.state.currentPage;
        const itemsPerPage = this.state.itemsPerPage;

        // Logic for displaying todos
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
        var renderItems = "";
        if (currentItems !== "") {
            renderItems = currentItems.map((d) => {
                return (

                    <Card style={{ width: '25rem' }} bg={'danger'} className="mb-2" text={'white'}>
                        <Card.Header as="h5">Name : {d.EventName}</Card.Header>
                        <Card.Body>
                            <Card.Title>Event Id : {d._id}</Card.Title>
                            <Card.Text>
                                Description : {d.Description}
                            </Card.Text>
                            <Card.Text>
                                Location : {d.Location}
                            </Card.Text>
                            <Card.Text>
                                Hashtags : {d.Hashtags}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            Time : {d.Time} ,
                                Date : {d.Date} ,
                                <Button variant="primary" onClick={() => this.customerListHandler(d)}>View List Of Customers</Button>
                        </Card.Footer>
                    </Card>
                )
            });
        }
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {

            return (

                <Pagination.Item key={number} id={number} onClick={this.handleClick} active={number === this.state.currentPage}>
                    {number}
                </Pagination.Item>
            );
        });


        return (
            <div>
                {redirectVar}
                <button type="button" class="btn btn-light btn-block btn btn-outline-danger" onClick={this.addEventHandler}>Add Event</button>
                {addEvent}
                {listCustomer}
                <CardColumns>
                    {renderItems}
                </CardColumns>

                <Pagination size="lg">
                    {renderPageNumbers}
                </Pagination>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    events : state.eventsState.events,
})

const mapDispatchToProps = { setEvents };


export default connect(mapStateToProps, mapDispatchToProps)(RestaurantEvents);