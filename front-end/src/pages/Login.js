import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner, Modal} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
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
            attemptLogin: false,
            failLogin : false

        }

        this.cookies = this.props.cookies;

        this.email = React.createRef();
        this.password = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.pageContent = this.pageContent.bind(this);
        this.attemptLogin = this.attemptLogin.bind(this);
        this.setUserCookies = this.setUserCookies.bind(this);
    };

    handleSubmit(){

        this.setState({
            loading : true,
            email : this.email.current.value,
            password : this.password.current.value,
            attemptLogin: true,
        });
    };

    setUserCookies(data){
        this.cookies.set('authenticated',true,{path:'/'});
        this.cookies.set('token',data.token,{path:'/'});
        this.cookies.set('userType',data.user_type,{path:'/'});
        this.cookies.set('expireTime',data.expire_time,{path:'/'});
    }

    attemptLogin(setUserCookies){
        if (this.state.attemptLogin){
            axios.defaults.baseURL = 'http://api.nono.fi:5000';

            axios.post('/login', {email : this.state.email, password: this.state.password})
            .then((response) => {
                if (response.status === 200){
                    setUserCookies(response.data)
                    this.setState({redirect : true});
                }
                else{
                    this.setState({failLogin:true, loading:false, attemptLogin:false});
                }
            }).catch((error) =>{
                this.setState({failLogin:true, loading:false, attemptLogin:false});
            });
        }
    }

    pageContent(){
        if(this.state.redirect === true){
            return(
                <Redirect to="/"/>
            );
        }

        else if(this.state.attemptLogin === true && this.state.loading === true){
            this.attemptLogin(this.setUserCookies);
        }

        

        else if (this.state.loading === true){
            return(
                <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
            );
        }

        else if (this.state.authenticated === null && this.state.loading === false){
            return(
            <Col md="6">
                
                <Modal show={this.state.failLogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login Failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Please verify your credentials and try again.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{this.setState({failLogin:false})}}>Close</Button>
                    </Modal.Footer>
                </Modal>

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
                                Not a member? <a href="/">Sign Up!</a>
                            </Form.Text>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            );
        }
    };
    
    render(){
        return(
            
            <Container style ={{marginTop: "2%"}}>
                <Row className="justify-content-md-center">                    
                        {this.pageContent()}
                </Row>
            </Container>
        );
    };
}

export default Login;