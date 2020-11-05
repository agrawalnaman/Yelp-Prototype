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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { Link } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';
import { setCustomerusers } from '../../redux/slices/customerusers';
import { connect } from "react-redux";

//Define a Login Component
class CustomerUsers extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            users: "",
            searchterm: "",
            category: "",
            eventnotfound: "",
            registration:"",
            filteredusers:"",
            usersnotfound:"",
            currentPage: 1,
            itemsPerPage: 3,
        };
        this.searchHandler = this.searchHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }



    componentDidMount() {

        var headers = new Headers();
        //prevent page from refresh
      
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .get("http://localhost:3001/getAllUsers")
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    this.setState({
                        //users: response.data,
                        filteredusers:response.data,
                        usersnotfound:"",
                    });
                    console.log(this.props.customerusers);
                    this.props.setCustomerusers(response.data);

                } else {
                    this.setState({
                        users: "",
                        filteredusers:"",
                        usersnotfound: "No User Found!",

                    });
                }
            })


    }
    searchHandler = (e) => {
        this.setState({
            searchterm: e.target.value,

        });
    };

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id),
        });
    };
    onChange = (e) => {
      
        //set the with credentials to true
        if(e==="following"){
        var data = { params: { idCustomers: localStorage.getItem("c_id") } };
        console.log("filter:", e);
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .get("http://localhost:3001/getFollowing",data)
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    this.setState({
                        filteredusers:response.data.following,
                        usersnotfound:"",
                    });
                   // console.log(this.props.customerusers);

                } else {
                    this.setState({
                        users: "",
                        filteredusers:"",
                        usersnotfound: "No User Found!",

                    });
                }
            })
        }
        else{
            this.setState({
                filteredusers:this.props.customerusers,
               
            });
        }

    

    };
    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value,
        });
    };
    submitSearchEvent = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            params: {
                searchterm: this.state.searchterm,
                category: this.state.category,

            }
        };
        console.log("search term:", this.state.searchterm);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .get("http://localhost:3001/getSearchUsers", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                      //  users: response.data,
                        filteredusers:response.data,
                    });
                   // console.log(this.props.customerusers);
                    this.props.setCustomerusers(response.data);

                } else {
                    this.setState({
                        users: "",
                        filteredusers:"",
                        usersnotfound: "No User Found!",
                    });
                }
            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });
    };



    render() {
        //redirect based on successful login
        let redirectVar = null;
        let invalidCredentials = null;
        if (!cookie.load("cookie")) {
            redirectVar = <Redirect to="/login" />;
        }
        const data = this.state.filteredusers;
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
        
                    <Card>
                        <Card.Header>             <Link to={{
                            pathname: "/CustomerProfileModular",
                            state: d._id,
                        }}>
                            <Card.Header as="h5"> User Name : {d.FirstName} {d.LastName}</Card.Header>
                            </Link>
                            <Card.Header as="h5"> NickName : {d.NickName}</Card.Header>
                        </Card.Header>
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
                <div class="row">       
                <div class ="col">
                <Form onSubmit={this.submitSearchEvent}>
                        <Form.Group controlId="formBasicEventName">
                            <Form.Label>Input Search Term</Form.Label>
                            <Form.Control type="text" placeholder="search term" onChange={this.searchHandler} required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Search Category</Form.Label>
                            <Form.Control as="select" onChange={this.categoryChangeHandler} defaultValue="select">
                                <option value="Location">Location</option>
                                <option value="NickName">NickName</option>
                                <option value="FirstName">FirstName</option>
                                <option value="select">Select</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Search Users
                    </Button>
                    </Form>
 
                </div>
               <div class="col">
                 <RadioGroup onChange={this.onChange} horizontal >
                    <RadioButton value="none" rootColor="#15b33d" pointColor="#0c0d0c">
                        Remove all Filters
                         </RadioButton>
                    <RadioButton value="following" rootColor="#3380de" pointColor="#0c0d0c" >
                        Following
                         </RadioButton>
                </RadioGroup> 
                </div>
                </div>

                {this.state.eventnotfound}
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
    customerusers : state.customerusersState.customerusers,
})

const mapDispatchToProps = { setCustomerusers };


export default  connect(mapStateToProps, mapDispatchToProps)(CustomerUsers);