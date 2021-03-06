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
import Pagination from 'react-bootstrap/Pagination';
import { setCustomerorders } from '../../redux/slices/customerorders';
import { connect } from "react-redux";

//Define a Login Component
class CustomerOrders extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
           // orders: "",
            filteredorders:"",
            idOrders:"",
            orderStatusEdited:"",
            deliveryMode:"",
            status:"",
            orderDetails:"",
            orderItemListModal:"",
            currentPage: 1,
            itemsPerPage: 3,


        };
        this.onChange=this.onChange.bind(this);
        this.cancelOrder=this.cancelOrder.bind(this);
        this.fetchOrderDetails=this.fetchOrderDetails.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount() {
        var data = { params: { idCustomers: localStorage.getItem("c_id") } };
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

        axios.get("http://35.163.78.149:3001/getCustomerOrders", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            const orderList = [];
            if(response.data!==""&&response.data!==undefined)
            {
            response.data.forEach(element =>element.orders.map((d) => {
                d.restaurantID=element._id;
                orderList.push(d);
            }));
        }
            this.setState({
                //orders: orderList,
                filteredorders:orderList,
                orderStatusEdited:"",
                deliveryMode:"",
                status:"",
                orderDetails:"",
                orderItemListModal:"",

            });

            this.props.setCustomerorders(orderList);
        });


    }

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id),
        });
    };
    cancelOrder = (idOrders,idRestaurants) => {
      
        var headers = new Headers();
        //prevent page from refresh
       
        const data = {
            orderstatus: "cancelled",
            idOrders: idOrders,
            idRestaurants:idRestaurants
        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://35.163.78.149:3001/updateOrderStatus", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Order Status Updated");
                    var data1 = { params: { idCustomers: localStorage.getItem("c_id") } };
                    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

                    axios.get("http://35.163.78.149:3001/getCustomerOrders", data1).then((response) => {
                        //update the state with the response data
                        console.log(response.data);
                        const orderList = [];
                        if(response.data!==""&&response.data!==undefined)
                        {
                            response.data.forEach(element =>element.orders.map((d) => {
                            d.restaurantID=element._id;
                            orderList.push(d);
                        }));
                    }
                        this.setState({
                           // orders: orderList,
                            filteredorders:orderList,
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
        console.log("filter", this.props.customerorders)
        if (this.props.customerorders !== "") {
            this.props.customerorders
            filter1 = this.props.customerorders.filter(function (d) {
                return d.orderStatus === e;
            });
        }
        this.setState({
            filteredorders: filter1,

        });

    };
    fetchOrderDetails = (orderDetails) => {
                    this.setState({
                        orderDetails: orderDetails.items,
                        orderItemListModal:true,
                    });
                
    }


    render() {
        let redirectVar = null;
        let invalidCredentials = null;
        if (!localStorage.getItem("token")) {
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
        const orderList = this.state.filteredorders;
        console.log("orderList:", orderList);
        const currentPage = this.state.currentPage;
        const itemsPerPage = this.state.itemsPerPage;

        // Logic for displaying todos
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = orderList.slice(indexOfFirstItem, indexOfLastItem);
        var renderItems = "";
        if (currentItems !== "") {
            renderItems = currentItems.map((d) => {
                return (
                    <Card  style={{ width: '25rem' }}>
                    <Card.Header as="h5"> Delivery Mode : {d.deliveryMode}</Card.Header>
                  
                    <Card.Body>
                        <Card.Title>  Order ID : {d._id}</Card.Title>
                        <Card.Text>
                            Time : {d.time}
                        </Card.Text>
                        <Card.Text>
                        Restaurant ID :{d.restaurantID}
                        </Card.Text>
                        {d.orderStatus!=="delivered" && d.orderStatus!=="pickedup" && d.orderStatus!=="cancelled" ?<Button variant="danger" onClick={() => this.cancelOrder(d._id,d.restaurantID)}>Cancel</Button>:<Button disabled>Cancel</Button>}
                    </Card.Body>
                    <Card.Footer>
                    
                    <large className="text-muted">Order Status : {d.orderStatus}</large>
                   <Button variant="primary" onClick={() => this.fetchOrderDetails(d)}>Order Details</Button> 
                    </Card.Footer>
                </Card>
                )
            }) ;
        }
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(orderList.length / itemsPerPage); i++) {
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
                    {renderItems}
                </CardColumns>

                <Pagination size="lg" >
                    {renderPageNumbers}
                </Pagination>
              
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    customerorders : state.customerordersState.customerorders,
})

const mapDispatchToProps = { setCustomerorders };

export default connect(mapStateToProps, mapDispatchToProps)(CustomerOrders);