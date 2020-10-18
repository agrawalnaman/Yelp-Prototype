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


//Define a Login Component
class Dishes extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            dishes: "",
            addDishModal: false,
            editDishModal: false,
            dishName: "",
            price: "",
            ingredients: "",
            category: "",
            imageURL: "",
            
            idDishes:"",
        
        };
        this.addDishHandler = this.addDishHandler.bind(this);
        this.editDishHandler = this.editDishHandler.bind(this);
        this.dishNameChangeHandler = this.dishNameChangeHandler.bind(this);
        this.priceChangeHandler = this.priceChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.ingredientsChangeHandler = this.ingredientsChangeHandler.bind(this);
        this.imageUrlChangeHandler = this.imageUrlChangeHandler.bind(this);
        this.submitAddDish = this.submitAddDish.bind(this);
        this.submitEditDish= this.submitEditDish.bind(this);
    }
    addDishHandler = (e) => {
        this.setState({
            addDishModal: true,

        });
    };
    editDishHandler = (d) => {
        this.setState({
            editDishModal: true,
            dishName: d.Name,
            price: d.Price,
            ingredients: d.Ingredients,
            category: d.Category,
            imageURL: d.Image,
            idDishes: d.idDishes,
        });
    };
    dishNameChangeHandler = (e) => {
        this.setState({
            dishName: e.target.value,
        });
    };
    priceChangeHandler = (e) => {
        this.setState({
            price: e.target.value,
        });
    };
    categoryChangeHandler = (e) => {
        this.setState({
            category: e.target.value,
        });
    };
    ingredientsChangeHandler = (e) => {
        this.setState({
            ingredients: e.target.value,
        });
    };
    imageUrlChangeHandler = (e) => {
        this.setState({
            imageURL: e.target.value,
        });
    };
    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantDishes", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                dishes: response.data,
                addDishModal: false,
                editDishModal: false,
                dishName: "",
                price: "",
                ingredients: "",
                category: "",
                idDishes:"",
            
            });
        });


    }


    submitEditDish = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            idRestaurants: +localStorage.getItem("r_id"),
            dishName: this.state.dishName,
            price: this.state.price,
            ingredients: this.state.ingredients,
            category: this.state.category,
            imageURL: this.state.imageURL,
            idDishes:this.state.idDishes,

        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/restaurantEditNewDish", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Dish Edited Successfully");
                    var data1 = { params: { idRestaurants: +localStorage.getItem("r_id") } };
            axios.get("http://localhost:3001/getRestaurantDishes", data1).then((response) => {
                //update the state with the response data
                console.log(response.data);
                this.setState({
                    dishes: response.data,
                    addDishModal: false,
                    editDishModal: false,
                    dishName: "",
                    price: "",
                    ingredients: "",
                    category: "",
                    idDishes:"",
                
                });
            });
                } else {
                    window.alert("Unable to edit dish!");

                }
            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });


            
    
    };


    submitAddDish = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            idRestaurants: +localStorage.getItem("r_id"),
            dishName: this.state.dishName,
            price: this.state.price,
            ingredients: this.state.ingredients,
            category: this.state.category,
            imageURL: this.state.imageURL,

        };
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        // this.props.signup(data);
        axios
            .post("http://localhost:3001/restaurantAddNewDish", data)
            .then((response) => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    window.alert("Dish Added To Menu!");
                    var data2 = { params: { idRestaurants: +localStorage.getItem("r_id") } };
            axios.get("http://localhost:3001/getRestaurantDishes", data2).then((response) => {
                //update the state with the response data
                console.log(response.data);
                this.setState({
                    dishes: response.data,
                    addDishModal: false,
                    editDishModal: false,
                    dishName: "",
                    price: "",
                    ingredients: "",
                    category: "",
                    idDishes:"",
                
                });
            });

                } else {
                    window.alert("Unable to Add Dish");
                }

            })
            .catch((e) => {
                debugger;
                console.log("FAIL!!!");
            });

            
    
    };

    render() {
        let addDish = (
            <Modal show={this.state.addDishModal} onHide={() => this.setState({ addDishModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitAddDish} >
                        <Form.Group controlId="formDishName">
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.dishNameChangeHandler} required />
                        </Form.Group>
                        <Form.Group controlId="Price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" placeholder="Price" onChange={this.priceChangeHandler} required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" onChange={this.categoryChangeHandler}>
                                <option value="Main Course">Main Course</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Salads">Salads</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formIngredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control type="text" placeholder="Ingredients" onChange={this.ingredientsChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formImageURL">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Image URL" onChange={this.imageUrlChangeHandler} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                       
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ addDishModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        let editDish = (
            <Modal show={this.state.editDishModal} onHide={() => this.setState({ editDishModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dish!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitEditDish} >
                        <Form.Group controlId="formDishName">
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={this.dishNameChangeHandler} defaultValue={this.state.dishName} required />
                        </Form.Group>
                        <Form.Group controlId="Price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" placeholder="Price" onChange={this.priceChangeHandler} defaultValue={this.state.price} required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" onChange={this.categoryChangeHandler} defaultValue={this.state.category}>
                                <option value="Main Course">Main Course</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Salads">Salads</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formIngredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control type="text" placeholder="Ingredients" onChange={this.ingredientsChangeHandler} defaultValue={this.state.ingredients}/>
                        </Form.Group>
                        <Form.Group controlId="formImageURL">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Image URL" onChange={this.imageUrlChangeHandler} defaultValue={this.state.imageURL}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Edit
                    </Button>
                
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ editDishModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
        const data = this.state.dishes;
        console.log("data:", data);
        return (
            <div>
                <button type="button" class="btn btn-light btn-block btn btn-outline-danger" onClick={this.addDishHandler}>Add Dish</button>
                {addDish}
                {editDish}
                <CardColumns>
                    {data !== "" ? data.map((d) => {
                        return (

                            <Card style={{ width: '25rem' }}>
                                <Card.Header as="h5"> Category : {d.Category}</Card.Header>
                                <Card.Img variant="top" src={d.Image} />
                                <Card.Body>
                                    <Card.Title>{d.Name}</Card.Title>
                                    <Card.Text>
                                        Price : ${d.Price}
                                    </Card.Text>
                                    <Card.Text>
                                        Ingredients : {d.Ingredients}
                                    </Card.Text>
                                    <Card.Text>
                                        Dish ID : {d.idDishes}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" onClick={() => this.editDishHandler(d)}>Edit</Button>
                                </Card.Footer>
                            </Card>
                        )
                    }) : ""}
                </CardColumns>
              
            </div>
        );
    }
}

export default Dishes;