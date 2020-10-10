import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import './Login.css';
const axios = require('axios');

class Login extends Component{

    constructor(){
        super();
        this.state = {
            username:"",
            password:"",
            token:"",
            loading: false,
            authenticated: false
        }

        this.username = React.createRef();
        this.password = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.cardContent = this.cardContent.bind(this);
    };

    cardContent(){
        if(this.state.loading === true){
            return(
                <Spinner animation="border" role="status"></Spinner>
            );
        }
        else if (this.state.authenticated === false && this.state.loading === false){
            return(
            <Card>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" ref={this.username} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" ref={this.password} />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick = {this.handleSubmit} >
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>);
        }
    };
    
    handleSubmit(){
        this.setState({
            loading : true,
            username : this.username.current.value,
            password : this.password.current.value
        });

        axios.post("/login",{

        })
        
    };
    
    render(){
        return(
            
            <Container className ="card-style">
                <Row className="justify-content-md-center">
                    <Col md="6">
                        {this.cardContent()}
                    </Col>
                </Row>
            </Container>
            
        );
    };
}

export default Login;