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
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Pagination from 'react-bootstrap/Pagination';
//Define a Login Component
class ResturantOrders extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            orders: "",
            filteredorders: "",
            orderStatusModal: false,
            idOrders: "",
            deliveryMode: "",
            status: "",
            currentPage: 1,
            itemsPerPage: 3,


        };
        this.editOrderStatusHandler = this.editOrderStatusHandler.bind(this);
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
        this.submitStatus = this.submitStatus.bind(this);
        this.onChange=this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    editOrderStatusHandler = (d) => {
        this.setState({
            orderStatusModal: true,
            idOrders: d._id,
            status: d.orderStatus,
            deliveryMode: d.deliveryMode,
        });
    };


    statusChangeHandler = (e) => {
        this.setState({
            status: e.target.value,
        });
    };

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id),
        });
    };

    componentDidMount() {
        var data = { params: { idRestaurants: localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantOrders", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                orders: response.data.orders,
                filteredorders: response.data.orders,
                orderStatusModal: false,
                orderStatusEdited: "",
                deliveryMode: "",
                status: "",
            });
        });


    }

    onChange = (e) => {
        // this.state.restaurants!== null ? filteredrestaurants = this.state.restaurants.filter(
        //         (restaurant) => restaurant.deliveryMode === e.target.value
        //     ) : "";
        var filter1 = "";
        console.log(e);
        console.log("filter", this.state.orders)
        if (this.state.orders !== "" && e === "orderrecieved") {
            filter1 = this.state.orders.filter(function (d) {
                return d.orderStatus === e;
            });
        }
        else if (this.state.orders !== "" && e === "finished") {
            filter1 = this.state.orders.filter(function (d) {
                return d.orderStatus === "delivered" || d.orderStatus === "pickedup";
            });
        }
        else if (this.state.orders !== "" && e === "cancelled") {
            filter1 = this.state.orders.filter(function (d) {
                return d.orderStatus === e;
            });
        }
        this.setState({
            filteredorders: filter1,

        });

    };

    submitStatus = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            orderstatus: this.state.status,
            idOrders: this.state.idOrders,
            idRestaurants: localStorage.getItem("r_id") 
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/updateOrderStatus", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Order Status Updated");
                    var data = { params: { idRestaurants: localStorage.getItem("r_id") } };
                    axios.get("http://localhost:3001/getRestaurantOrders", data).then((response) => {
                        //update the state with the response data
                        console.log(response.data);
                        this.setState({
                            orders: response.data.orders,
                            filteredorders: response.data.orders,
                            orderStatusModal: false,
                            orderStatusEdited: "",
                            deliveryMode: "",
                            status: "",
                        });
                    });
            


                } else {
                    window.alert("unable to update");
                }
            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });
    };




    render() {
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        let orderStatus = (
            <Modal show={this.state.orderStatusModal} onHide={() => this.setState({ orderStatusModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitStatus} >
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
                            {this.state.deliveryMode === "delivery" ? (<Form.Control as="select" onChange={this.statusChangeHandler} defaultValue={this.state.status}>
                                <option value="orderrecieved">Order Recieved</option>
                                <option value="preparing">Preparing</option>
                                <option value="ontheway">On The Way</option>
                                <option value="delivered">Delivered</option>
                            </Form.Control>) : (<Form.Control as="select" onChange={this.statusChangeHandler} defaultValue={this.state.status}>
                                <option value="orderrecieved">Order Recieved</option>
                                <option value="preparing">Preparing</option>
                                <option value="pickupready">Pick Up Ready</option>
                                <option value="pickedup">Picked Up</option>
                            </Form.Control>)}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update
                    </Button>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ orderStatusModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
        const data = this.state.filteredorders;
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

                    <Card style={{ width: '25rem' }}>
                        <Card.Header as="h5"> Category : {d.deliveryMode}</Card.Header>
                        <Card.Body>
                            <Card.Title>  Order ID : {d._id}</Card.Title>
                            <Card.Text>
                                Time : {d.time}
                            </Card.Text>
                            <Link to={{
                                pathname: "/CustomerProfileModular",
                                state: d.idCustomers,
                            }}>
                                <Card.Text>
                                    Customer ID :{d.idCustomers}
                                </Card.Text>
                            </Link>
                        </Card.Body>
                        <Card.Footer>

                            <large className="text-muted">Order Status : {d.orderStatus}</large>
                            <Button variant="primary" onClick={() => this.editOrderStatusHandler(d)}>Update Status</Button>
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
                
                <Pagination.Item key={number}
                    id={number}
                    onClick={this.handleClick}  active={number === this.state.currentPage} >{number}</Pagination.Item>
            );
        });
        return (
            <div>
                {redirectVar}
                {orderStatus}
                <RadioGroup onChange={this.onChange} horizontal >
                    <RadioButton value="orderrecieved" rootColor="#de3933" pointColor="#0c0d0c">
                        New Order
                         </RadioButton>
                    <RadioButton value="finished" rootColor="#3380de" pointColor="#0c0d0c">
                        Delivered Order
                         </RadioButton>
                    <RadioButton value="cancelled" rootColor="#15b33d" pointColor="#0c0d0c">
                        Cancelled Order
                        </RadioButton>
                </RadioGroup>


            
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

export default ResturantOrders;