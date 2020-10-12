import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
// import './Account.css';

class Account extends Component{

    constructor(props){
        super(props);

        this.state = {
            loading : true
        }

        this.cookies = this.props.cookies;
        this.pageContent = this.pageContent.bind(this);
        this.loadAccount = this.loadAccount.bind(this);
    }

    pageContent(){
        if (this.state.loading === true){
            return(
                <Row className="justify-content-md-center">
                <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
                </Row>
            );
        }
        else{
            return(
                <>
                <Card style={{padding:'10px'}}>
                    <Card.Title>
                        User Name Here
                    </Card.Title>
                    <Card.Body>
                        <Form>
                        <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                            </Form.Group>

                            <Form.Group controlId="formGridAddress2">
                                <Form.Label>Address 2</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                            </Form.Group>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State/Territory</Form.Label>
                                <Form.Label>City</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>PostCode</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridBSB">
                                <Form.Label>BSB</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com"  />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridAccountNumber">
                                <Form.Label>Account Number</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="email@example.com" />
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
                    </Card.Body>
                </Card>
                <br/>
                <Card style={{padding:'10px'}}>
                    <Card.Title>
                        Change Payment Details
                    </Card.Title>
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
                </Card>
                </>
            );
        }
    }

    loadAccount(){
        if (this.state.loading === true){
            // Replace with API Call later
            setTimeout(()=>
            {this.setState({loading : false });}, 50);
        }
    }

    render(){
        return(
            <Container className = "pageContent">
                {this.pageContent()}
                {this.loadAccount()}
            </Container>
        );
    }
}

export default Account;