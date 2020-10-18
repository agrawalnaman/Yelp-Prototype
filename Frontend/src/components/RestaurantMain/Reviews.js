import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Table from 'react-bootstrap/Table';
//Define a Login Component
class Reviews extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            reviews: "",

        };
    }

    componentDidMount() {
        var data = { params: { idRestaurants: +localStorage.getItem("r_id") } };
        axios.get("http://localhost:3001/getRestaurantReviews", data).then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                reviews: response.data,
            });
        });
    }

    render() {
        const data = this.state.reviews;
        console.log("data:", data);
        return (
            <div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Review id</th>
                            <th>CustomerID</th>
                            <th>Comment</th>
                            <th>Ratings</th>
                            <th>Date - Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data !== "" ? data.map(function (d) {
                            return (

                                <tr>
                                    <td>{d.idReviews}</td>
                                    <td>{d.customerID}</td>
                                    <td>{d.comments}</td>
                                    <td>{d.ratings}</td>
                                    <td>{d.reviewDate}</td>
                                </tr>
                            )
                        }) : ""}
                        {/* {data !== "" ? data.map(function (d) { return (<li><label>ID:</label>{d.idReviews}<label>comments:</label>{d.comments}</li>) }) : ""} */}
                    </tbody>
                </Table>
            </div>
        );
    }

}

export default Reviews;