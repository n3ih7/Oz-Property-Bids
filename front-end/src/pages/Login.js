import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import './Login.css';
const axios = require('axios');

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            username:"",
            password:"",
            loading: false,
            authenticated: null,
            redirect: false
        }

        this.cookies = this.props.cookies;
        this.cookies.set('authenticated', true, {path:'/'})

        this.username = React.createRef();
        this.password = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.pageContent = this.pageContent.bind(this);
    };

    pageContent(){
        if(this.state.redirect === true){
            return(
                <Redirect to="/"/>
            )
        }

        else if (this.state.loading === true){
            return(
                <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
            );
        }

        else if (this.state.authenticated === null && this.state.loading === false){
            return(
            <Col md="6">
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
                            <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {this.handleSubmit} >
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            );
        }
    };
    
    handleSubmit(){

        this.setState({
            loading : true,
            username : this.username.current.value,
            password : this.password.current.value,
            authenticated: true,
            redirect : false
        });


        // axios.post("/login",{
        //     email: this.state.email,
        //     password: this.state.password
        // }).then(
        //     function(response){
        //         if(response.status === 200){
        //             this.cookies.set('username', this.state.username ,{path:'/'});
        //             this.cookies.set('password', this.state.password ,{path:'/'});
        //             // this.cookies.set('token', response.data.token ,{path:'/'});
        //             this.cookies.set('authenticated', true ,{path:'/'});
        //         }
        //     }
        // )
        
    };
    
    render(){
        return(
            
            <Container className ="card-style">
                <Row className="justify-content-md-center">                    
                        {this.pageContent()}
                </Row>
            </Container>
        );
    };
}

export default Login;