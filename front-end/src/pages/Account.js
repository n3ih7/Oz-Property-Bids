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
            bsb :"",
            acc_number :""

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
                    bsb : response.data.bsb,
                    acc_number : response.data.acc_number,
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

    handlePaymentChange(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.put('/profile_update', {
            old_password: this.passwordBSB.current.value,
            new_bsb: this.newBSB.current.value,
            new_acc_number: this.newAccountNumber.current.value
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
                <Card style={{padding:'10px', marginTop: "2%"}}>
                    <Card.Title>
                        Hello, {this.state.firstName}
                    </Card.Title>
                    <Card.Body>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.firstName+" "+this.state.lastName} />
                                </Form.Group>
        
                                <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.email} />
                                </Form.Group>
                            </Form.Row>
                            
                            <Form.Row>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.address} />
                            </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.city} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State/Territory</Form.Label>
                                <Form.Label>City</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.state} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>PostCode</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.postcode} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridBSB">
                                <Form.Label>BSB</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.bsb}  />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridAccountNumber">
                                <Form.Label>Account Number</Form.Label>
                                <Form.Control plaintext readOnly value={this.state.acc_number} />
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
                <br/>
                <Card style={{padding:'10px'}}>
                    <Card.Title>
                        Change Payment Details
                    </Card.Title>
                    <Card.Body>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCurrentPasswordBSB">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" placeholder="" ref={this.passwordBSB} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridNewPassword">
                            <Form.Label>New BSB</Form.Label>
                            <Form.Control type="password" placeholder="" ref={this.newBSB} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridVerifyNewPassword">
                            <Form.Label>New Account Number</Form.Label>
                            <Form.Control type="password" placeholder="" ref={this.newAccountNumber} />
                            </Form.Group>
                        </Form.Row>
                        <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handlePaymentChange()}}>
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