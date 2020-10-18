import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RadioGroup, RadioButton } from 'react-radio-buttons';

//Define a Login Component
class CustomerOrders extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            orders: "",
            filteredorders:"",
            idOrders:"",
            orderStatusEdited:"",
            deliveryMode:"",
            status:"",
            orderDetails:"",
            orderItemListModal:"",


        };
        this.onChange=this.onChange.bind(this);
        this.cancelOrder=this.cancelOrder.bind(this);
        this.fetchOrderDetails=this.fetchOrderDetails.bind(this);
    }


    componentDidMount() {
        var data = { params: { idCustomers: +localStorage.getItem("c_id") } };
        axios.get("http://localhost:3001/getCustomerOrders", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                orders: response.data,
                filteredorders:response.data,
                orderStatusEdited:"",
                deliveryMode:"",
                status:"",
                orderDetails:"",
                orderItemListModal:"",

            });
        });


    }


    cancelOrder = (idOrders) => {
      
        var headers = new Headers();
        //prevent page from refresh
       
        const data = {
            orderstatus: "cancelled",
            idOrders: idOrders,
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
                    var data1 = { params: { idCustomers: +localStorage.getItem("c_id") } };
                    axios.get("http://localhost:3001/getCustomerOrders", data1).then((response) => {
                        //update the state with the response data
                        console.log(response.data);
                        this.setState({
                            orders: response.data,
                            filteredorders:response.data,
                            orderStatusEdited:"",
                            deliveryMode:"",
                            status:"",
                            
                        });
                    });
            


                } else {
                    window.alert("unable to update");
                }
            })
            .catch(() => {
                debugger;
                console.log("FAIL!!!");
            });
    };


    onChange = (e) => {
        // this.state.restaurants!== null ? filteredrestaurants = this.state.restaurants.filter(
        //         (restaurant) => restaurant.deliveryMode === e.target.value
        //     ) : "";
        var filter1 = "";
        console.log(e);
        console.log("filter", this.state.orders)
        if (this.state.orders !== "") {
            filter1 = this.state.orders.filter(function (d) {
                return d.orderStatus === e;
            });
        }
        this.setState({
            filteredorders: filter1,

        });

    };
    fetchOrderDetails = (idOrders) => {
        var data = { params: { idOrders: idOrders } };
        axios.get("http://localhost:3001/getCustomerOrderDetails", data).then((response) => {
            //update the state with the response data
            console.log("OrderDetails:",response.data);
            this.setState({
                orderDetails: response.data,
                orderItemListModal:true,
            });
        });
    }


    render() {
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }

        let orderItemList = (
            <Modal show={this.state.orderItemListModal} onHide={() => this.setState({ orderItemListModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Customer List</Modal.Title>
                </Modal.Header>
                {this.state.orderDetails !== undefined && this.state.orderDetails.length !== 0  ? this.state.orderDetails.map((d) => {
                   
                    return(

                           <li>Name:{d.Name} , Price:$ {d.Price} , Quantity:{d.quantity}</li>
                    )}) :"No Item Found In Bill"}

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({orderItemListModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
        const data = this.state.filteredorders;
        console.log("data:", data);
        return (
            <div>
                 {redirectVar}
                 <RadioGroup onChange={this.onChange} horizontal >
                    <RadioButton value="orderrecieved" rootColor="#15b33d" pointColor="#0c0d0c">
                        Order Recieved
                         </RadioButton>
                    <RadioButton value="preparing" rootColor="#3380de" pointColor="#0c0d0c">
                        Preparing
                         </RadioButton>
                    <RadioButton value="ontheway" rootColor="#de3933 " pointColor="#0c0d0c">
                        On the Way (Delivery)
    
                        </RadioButton>
                        <RadioButton value="delivered" rootColor="#de3933 " pointColor="#0c0d0c">
                        Delivered  (Delivery)
                        </RadioButton>
                        <RadioButton value="pickupready" rootColor="#de3933 " pointColor="#0c0d0c">
                        Pick up Ready (PickUp)
                        </RadioButton> 
                        <RadioButton value="pickedup" rootColor="#de3933 " pointColor="#0c0d0c">
                        Picked Up (PickUp)
                        </RadioButton>
                </RadioGroup>
                {orderItemList}
                <CardColumns>
                    {data !== "" ? data.map((d) => {
                        return (

                            <Card  style={{ width: '25rem' }}>
                            <Card.Header as="h5"> Delivery Mode : {d.deliveryMode}</Card.Header>
                          
                            <Card.Body>
                                <Card.Title>  Order ID : {d.idOrders}</Card.Title>
                                <Card.Text>
                                    Time : {d.time}
                                </Card.Text>
                                <Card.Text>
                                Restaurant ID :{d.restaurantID}
                                </Card.Text>
                                {d.orderStatus!=="delivered" && d.orderStatus!=="pickedup" && d.orderStatus!=="cancelled" ?<Button variant="danger" onClick={() => this.cancelOrder(d.idOrders)}>Cancel</Button>:<Button disabled>Cancel</Button>}
                            </Card.Body>
                            <Card.Footer>
                            
                            <large className="text-muted">Order Status : {d.orderStatus}</large>
                           <Button variant="primary" onClick={() => this.fetchOrderDetails(d.idOrders)}>Order Details</Button> 
                            </Card.Footer>
                        </Card>
                        )
                    }) : ""}
                </CardColumns>
              
            </div>
        );
    }
}

export default CustomerOrders;