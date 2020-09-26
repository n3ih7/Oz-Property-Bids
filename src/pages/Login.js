import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button} from 'react-bootstrap';

class Login extends Component{

    render(){
        return(
            <Container className ="card-style">
                <Row className="justify-content-md-center">
                    <Col md="6">
                        <Card>
                            <Card.Body>
                                <Card.Title>Login</Card.Title>
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="I'm Buying" />
                                        <Form.Check type="checkbox" label="I'm Selling" />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;