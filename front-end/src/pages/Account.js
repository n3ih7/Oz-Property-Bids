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
                <Card>
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
                <Card>
                    <Card.Title>
                        Change Password
                    </Card.Title>
                </Card>
                <br/>
                <Card>
                    <Card.Title>
                        Change Payment Details
                    </Card.Title>
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