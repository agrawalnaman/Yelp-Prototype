import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/esm/Button";
import { Row, Col, Container } from "react-bootstrap";
import { setMessages } from '../../redux/slices/messages';
import { connect } from "react-redux";
class Messages extends Component {

    constructor(props) {

        super(props);

        this.state = {
            messages: [],
            value: ""
        };



    }

    componentDidMount() {
        axios.get("http://35.163.78.149:3001/getMessage").then((response) => {
            //update the state with the response data
            console.log("profile did mount11111:", response.data);
            this.props.setMessages(response.data);

    });
    };

    sendClicked = (e) => {
        const text = this.state.value;     
        console.log(text); 
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        axios.defaults.withCredentials = true;
        const data = {
            message:text
        };
        axios
        .post("http://35.163.78.149:3001/postMessage", data)
        .then((response) => {
            console.log("Status Code : ", response);
            if (response.status === 200) {
                 window.alert("message posted");

            } else {
                console.log("message sent status else:", response.status);
                window.alert("Unable to send messages");

            }
        }) .catch((e) => {
            debugger;
            console.log("FAIL!!!");
        });
    }


    render() {
        //const data = ["aaaa","bbbb","cccc"];
        const data = this.props.messages;
        return (
            <Container>
                <Row style={{ background: 'red', color: 'white'}} className={"justify-content-md-center"}>Messages</Row>
                <Row>
                    <Col>Restaurant</Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col>Customer</Col>
                </Row>
                {data.map((message, index) => (
                    <Row style={{ background: index%2 ? 'lightGrey' : 'grey'}} className={ index%2 ? "justify-content-md-end": "justify-content-md-start"}>
                        {message.messages}
                    </Row>

                    ))}
                <Row>
                    <Col><input value={this.state.value} onChange={e => this.setState({value: e.target.value})}/></Col>
                    <Col><Button onClick={this.sendClicked}>Send</Button></Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    messages : state.messagesState.messages,
})

const mapDispatchToProps = { setMessages };
export default connect(mapStateToProps, mapDispatchToProps)(Messages);