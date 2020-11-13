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
            oldPassword:"",
            newPassword:"",
            verifyPassword:"",
            editDetails: false
        }

        this.cookies = this.props.cookies;
        this.getAccountDetails = this.getAccountDetails.bind(this);
        this.updateAccountDetails = this.updateAccountDetails.bind(this);
        
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
                    phone : response.data.phone,
                    postcode : response.data.postcode,
                    state : response.data.state,
                    loading: false
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    updateAccountDetails(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.put('/profile', {
            firstname : this.state.firstName,
            lastname : this.state.lastName,
            address_line_1 : this.state.address,
            city : this.state.city,
            email : this.state.email,
            phone : this.state.phone,
            postcode : this.state.postcode,
            state : this.state.state
        }).then((response) => {
            console.log(response);
            if (response.status === 200){
                this.setState({editDetails: false});
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    handlePasswordChange(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.put('/profile_update', {
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
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


    render(){

        if (this.state.loading){
            return(
                <Container className = "pageContent">
                    <Row className="justify-content-md-center">
                        <Spinner animation="border" variant="light" role="status" style={{marginTop:"20%"}}></Spinner>
                        {this.getAccountDetails()}
                    </Row>
                </Container>
            );
        }
        else if (this.state.editDetails){
            return(
                <Container className = "pageContent">
                    <Card style={{padding:'10px', marginTop: "2%"}}>
                        <Card.Title>
                            Hello, {this.state.firstName}
                        </Card.Title>
                        <Card.Body>
                            <Form>
                            <h4>Contact Information</h4>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control  value={this.state.firstName} onChange ={(e) =>{this.setState({firstName: e.target.value})}}/>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control  value={this.state.lastName} onChange ={(e) =>{this.setState({lastName: e.target.value})}} />
                                    </Form.Group>
                                </Form.Row>
                                    
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control   value={this.state.email} onChange ={(e) =>{this.setState({email: e.target.value})}}/>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridPhone">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control   value={this.state.phone} onChange ={(e) =>{this.setState({phone: e.target.value})}}/>
                                    </Form.Group>
                                </Form.Row>
                                <br/>
                                <h4>Address</h4>

                                <Form.Row>
                                    <Form.Group as ={Col} controlId="formGridAddress1">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control   value={this.state.address} onChange ={(e) =>{this.setState({address: e.target.value})}} />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control   value={this.state.city} onChange ={(e) =>{this.setState({city: e.target.value})}} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>State/Territory</Form.Label>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control   value={this.state.state}  onChange ={(e) =>{this.setState({state: e.target.value})}}/>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>PostCode</Form.Label>
                                    <Form.Control   value={this.state.postcode} onChange ={(e) =>{this.setState({postcode: e.target.value})}}/>
                                    </Form.Group>
                                </Form.Row>
                                </Form>
                                <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.updateAccountDetails()}}>
                                Save!
                                </Button>
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
                                <Form.Control type="password" placeholder="" ref={this.state.oldPassword} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" placeholder="" ref={this.state.newPassword} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridVerifyNewPassword">
                                <Form.Label>Verify Password</Form.Label>
                                <Form.Control type="password" placeholder="" ref={this.state.verifyPassword} />
                                </Form.Group>
                            </Form.Row>
                            <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handlePasswordChange()}}>
                                Submit
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
        else if (!this.state.editDetails){
            return(
                <Container className = "pageContent">
                    <Card style={{padding:'10px', marginTop: "2%"}}>
                        <Card.Title>
                            Hello, {this.state.firstName}
                        </Card.Title>
                        <Card.Body>
                            <Form>
                            <h4>Contact Information</h4>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control plaintext readOnly value={this.state.firstName} onChange ={(e) =>{this.setState({firstName: e.target.value})}}/>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control plaintext readOnly value={this.state.lastName} onChange ={(e) =>{this.setState({lastName: e.target.value})}} />
                                    </Form.Group>
                                </Form.Row>
                                    
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control plaintext readOnly value={this.state.email} onChange ={(e) =>{this.setState({email: e.target.value})}}/>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridPhone">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control plaintext readOnly value={this.state.phone} onChange ={(e) =>{this.setState({phone: e.target.value})}}/>
                                    </Form.Group>
                                </Form.Row>
                                <br/>
                                <h4>Address</h4>
                                <Form.Row>
                                    <Form.Group as ={Col} controlId="formGridAddress1">
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
                                <Button variant="secondary" type="submit" onClick = {() => {this.setState({editDetails:true})}}>
                                Edit
                                </Button>
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
                                <Form.Control type="password" placeholder="" value={this.state.oldPassword} onChange ={(e) =>{this.setState({oldPassword: e.target.value})}}/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" placeholder="" value={this.state.newPassword} onChange ={(e) =>{this.setState({newPassword: e.target.value})}} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridVerifyNewPassword">
                                <Form.Label>Verify Password</Form.Label>
                                <Form.Control type="password" placeholder="" value={this.state.verifyPassword} onChange ={(e) =>{this.setState({verifyPassword: e.target.value})}}/>
                                </Form.Group>
                            </Form.Row>
                            <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handlePasswordChange()}}>
                                Submit
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
    }
}

export default Account;