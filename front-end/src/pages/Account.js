import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
const axios = require('axios');

class Account extends Component{

    constructor(props){
        super(props);

        this.state = {
            loading : true,
            firstName : "",
            lastName : "",
            address : "",
            city : "",
            email :"",
            postcode :"",
            state :"",
            editDetails: false
        }

        this.oldPassword = React.createRef();
        this.newPassword = React.createRef();
        this.verifyPassword = React.createRef();
        this.passwordBSB = React.createRef();
        this.newBSB = React.createRef();
        this.newAccountNumber = React.createRef();

        this.cookies = this.props.cookies;
        this.pageContent = this.pageContent.bind(this);
        this.getAccountDetails = this.getAccountDetails.bind(this);
        
    }

    getAccountDetails(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.get('/profile')
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                this.setState({
                    firstName : response.data.firstname,
                    lastName : response.data.lastname,
                    address : response.data.address,
                    city : response.data.city,
                    email : response.data.email,
                    postcode : response.data.postcode,
                    state : response.data.state,
                    loading: false,
                    editDetails : true
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    changeAccountDetails(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.get('/profile')
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                this.setState({
                    firstName : response.data.firstname,
                    lastName : response.data.lastname,
                    address : response.data.address,
                    city : response.data.city,
                    email : response.data.email,
                    postcode : response.data.postcode,
                    state : response.data.state,
                    loading: false
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    handlePasswordChange(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.put('/profile_update', {
            old_password: this.oldPassword.current.value,
            new_password: this.newPassword.current.value,
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                // Show notification that this worked
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    pageContent(){
        if (this.state.loading === true){
            return(
                <Row className="justify-content-md-center">
                <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
                {this.getAccountDetails()}
                </Row>
            );
        }
        else{
            return(
                <>
                <Card style={{padding:'10px', marginTop: "2%"}} onClick ={() => {this.setState({editDetails : true})}}>
                    <Card.Title>
                        Hello, {this.state.firstName}
                    </Card.Title>
                    <Card.Body>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control plaintext readOnly={!this.editDetails} value={this.state.firstName+" "+this.state.lastName} />
                                </Form.Group>
        
                                <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.email} onChange ={(e) =>{this.setState({email: e.target.value})}}/>
                                </Form.Group>
                            </Form.Row>
                            
                            <Form.Row>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.address} onChange ={(e) =>{this.setState({address: e.target.value})}} />
                            </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.city} onChange ={(e) =>{this.setState({city: e.target.value})}} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State/Territory</Form.Label>
                                <Form.Label>City</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.state}  onChange ={(e) =>{this.setState({state: e.target.value})}}/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>PostCode</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.postcode} onChange ={(e) =>{this.setState({postcode: e.target.value})}}/>
                                </Form.Group>
                            </Form.Row>
                            </Form>
                    </Card.Body>
                </Card>
                <br/>

                <Card style={{padding:'10px'}}>
                    <Card.Title>
                        Change Password
                    </Card.Title>
                    <Card.Body>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCurrentPassword">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" placeholder="" ref={this.oldPassword} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="" ref={this.newPassword} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridVerifyNewPassword">
                            <Form.Label>Verify Password</Form.Label>
                            <Form.Control type="password" placeholder="" ref={this.verifyPassword} />
                            </Form.Group>
                        </Form.Row>
                        <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handlePasswordChange()}}>
                            Submit
                        </Button>
                    </Card.Body>
                </Card>
                </>
            );
        }
    }


    render(){
        return(
            <Container className = "pageContent">
                {this.pageContent()}
            </Container>
        );
    }
}

export default Account;