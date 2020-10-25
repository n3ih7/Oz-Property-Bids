import React, {Component} from 'react';
import {Card, Container, Col, Row, Form, Button, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import './SignUp.css';
const axios = require('axios');

class SignUp extends Component{

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            redirect: false,
            buyer : false,
            seller : false
        }
        this.firstName = React.createRef();
        this.lastName = React.createRef();
        this.email = React.createRef();
        this.password1 = React.createRef();
        this.password2 = React.createRef();
        this.address1 = React.createRef();
        this.address2 = React.createRef();
        this.city = React.createRef();
        this.territory = React.createRef();
        this.postCode = React.createRef();
        this.bsb = React.createRef();
        this.accountNumber = React.createRef();
        this.phone = React.createRef();

        this.cookies = this.props.cookies;

        this.pageContent = this.pageContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    formCheckbox(){
        if(this.state.buyer === false && this.state.seller === false){
            return(
                <Form.Row>
                    <Form.Group as ={Col}>
                    <Form.Check type="checkbox" id="default-radio" label="I'm looking to buy a house" onClick={() => {this.setState({buyer: !this.state.buyer})}}></Form.Check>
                    </Form.Group>
                    <Form.Group as ={Col}>
                    <Form.Check type="checkbox" id="default-radio" label="I'm looking to sell a house" onClick={() => {this.setState({seller: !this.state.seller})}}></Form.Check>
                    </Form.Group>
                </Form.Row>
            );

        }
        else if(this.state.buyer === true && this.state.seller === false){
            return(
                <Form.Row>
                    <Form.Group as ={Col}>
                    <Form.Check type="checkbox" id="default-radio" label="I'm looking to buy a house" onClick={() => {this.setState({buyer: !this.state.buyer})}}></Form.Check>
                    </Form.Group>
                    <Form.Group as ={Col}>
                    <Form.Check type="checkbox" id="default-radio" label="I'm looking to sell a house" disabled onClick={() => {this.setState({seller: !this.state.seller})}}></Form.Check>
                    </Form.Group>
                </Form.Row>
            );
        }
        else if(this.state.buyer === false && this.state.seller === true){
            return(
                <Form.Row>
                    <Form.Group as ={Col}>
                    <Form.Check type="checkbox" id="default-radio" label="I'm looking to buy a house" disabled onClick={() => {this.setState({buyer: !this.state.buyer})}}></Form.Check>
                    </Form.Group>
                    <Form.Group as ={Col}>
                    <Form.Check type="checkbox" id="default-radio" label="I'm looking to sell a house" onClick={() => {this.setState({seller: !this.state.seller})}}></Form.Check>
                    </Form.Group>
                </Form.Row>
            );
        }
    }
    
    pageContent(){
        if (this.state.redirect === true){
            return(
                <Redirect to="/"/>
            )
        }
        else if (this.state.loading === true){
            
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
                    <Card.Title style ={{marginLeft:"15px"}}>
                        <h1>Sign Up</h1>
                    </Card.Title>
                <Card.Body>
                    <Form>
                    <Form.Row>
                            <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="" placeholder="" ref={this.firstName}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="" placeholder="" ref={this.lastName} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" ref={this.email}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control placeholder="" ref={this.phone} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridPassword1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" ref={this.password1} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" ref={this.password2} />
                            </Form.Group>
                        </Form.Row>

                        
                        
                        <Form.Group controlId="formGridAddress1">
                            <Form.Label>Address</Form.Label>
                            <Form.Control placeholder="1234 Main St" ref={this.address1} />
                        </Form.Group>

                        <Form.Group controlId="formGridAddress2">
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control placeholder="Apartment, studio, or floor" ref={this.address2} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control ref={this.city} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>State/Territory</Form.Label>
                            <Form.Control as="select" defaultValue="Choose..." ref={this.territory}>
                                <option>Choose...</option>
                                <option>NSW</option>
                                <option>VIC</option>
                                <option>QLD</option>
                                <option>ACT</option>
                                <option>TAS</option>
                                <option>SA</option>
                                <option>WA</option>
                                <option>NT</option>
                            </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip" ref={this.postCode}>
                            <Form.Label>PostCode</Form.Label>
                            <Form.Control />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>BSB</Form.Label>
                            <Form.Control placeholder="" ref={this.bsb} />
                            <Form.Text className="text-muted">
                                We will only share these details if you win at auction
                            </Form.Text>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword" ref={this.accountNumber}>
                            <Form.Label>Account Number</Form.Label>
                            <Form.Control type="password" placeholder="" />
                                
                            </Form.Group>
                        </Form.Row>

                        {this.formCheckbox()}

                        <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handleSubmit()}}>
                            Submit
                        </Button>

                        <Form.Text className="text-muted" style={{textAlign:"right"}}>
                                <a href="/login">Already have an account?</a>
                        </Form.Text>
                    </Form>
                </Card.Body>
                </Card>
                </>
            );
        }
    }

    handleSubmit(){

        this.setState({
            loading : true,
            firstName: this.firstName.current.value,
            lastName : this.lastName.current.value,
            email : this.email.current.value,
            password1 : this.password1.current.value,
            password2 : this.password1.current.value,
            address1 : this.address1.current.value,
            address2 : this.address2.current.value,
            city : this.city.current.value,
            territory : this.territory.current.value,
            postCode : this.postCode .current.value,
            bsb : this.bsb.current.value,
            accountNumber : this.accountNumber.current.value,
        });

        axios.defaults.baseURL = 'http://api.nono.fi:5000';

        axios.post('/signup', {email : this.email.current.value, password: this.password1.current.value})
        .then((response) => {
            console.log(response);
            // console.log(response.headers['Set-Cookie']);
            // console.log(response.headers['session']);
            if (response.status === 200){
                this.cookies.set('authenticated',true,{path:'/'});
                // this.cookies.set('user',this.email.current.value,{path:'/'});
                this.setState({redirect : true});
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        return(
            <Container className = "pageContent">
                {this.pageContent()}
            </Container>
        );
    }
}

export default SignUp;