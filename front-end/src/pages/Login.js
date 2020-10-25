import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import './Login.css';
const axios = require('axios');

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            loading: false,
            authenticated: null,
            redirect: false,
            attemptLogin: false
        }

        this.cookies = this.props.cookies;

        this.email = React.createRef();
        this.password = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.pageContent = this.pageContent.bind(this);
        this.attemptLogin = this.attemptLogin.bind(this);
        this.setUserCookies = this.setUserCookies.bind(this);
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
                                <Form.Control type="email" placeholder="Enter email" ref={this.email} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" ref={this.password} />
                            </Form.Group>
                            <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {this.handleSubmit} >
                                Submit
                            </Button>
                            <Form.Text className="text-muted" style={{textAlign:"right"}}>
                                <a href="/">Forgot your password?</a>
                            </Form.Text>
                        </Form>
                    </Card.Body>
                </Card>
                <br/>
                <Row className="justify-content-md-center">
                    <Card className="text-center" style={{width:"290px", height:"50px"}}>
                        <Card.Body>
                            <Card.Subtitle className="mb-2 text-muted">
                                <a>Not a member?</a>
                                <a style={{paddingLeft:"30px"}}> </a>
                                <Card.Link href="http://localhost:3000/signup">Sign Up!</Card.Link>
                            </Card.Subtitle>
                        </Card.Body>
                    </Card>
                </Row>
            </Col>
            );
        }
    };
    
    handleSubmit(){

        this.setState({
            loading : true,
            email : this.email.current.value,
            password : this.password.current.value,
            attemptLogin: true
        });
    };

    setUserCookies(data){
        this.cookies.set('authenticated',true,{path:'/'});
        this.cookies.set('email',this.state.email,{path:'/'});
        this.cookies.set('token',data.message,{path:'/'});
        this.cookies.set('userType',"seller",{path:'/'});
    }

    attemptLogin(setUserCookies){
        if (this.state.attemptLogin){
            axios.defaults.baseURL = 'http://api.nono.fi:5000';

            axios.post('/login', {email : this.state.email, password: this.state.password})
            .then((response) => {
                console.log(response);
                console.log(response.headers['Set-Cookie']);
                console.log(response.headers['session']);
                if (response.status === 200){
                    setUserCookies(response.data)
                    this.setState({redirect : true});
                }
            }).catch((error) =>{
                console.log(error);
            });
        }
    }
    
    render(){
        return(
            
            <Container className ="card-style">
                <Row className="justify-content-md-center">                    
                        {this.pageContent()}
                        {this.attemptLogin(this.setUserCookies)}
                </Row>
            </Container>
        );
    };
}

export default Login;