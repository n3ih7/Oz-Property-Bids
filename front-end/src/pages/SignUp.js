import React, {Component} from 'react';
import {Card, Container, Col, Row, Form, Button, Spinner, Modal} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class SignUp extends Component{

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            redirect: false,
            buyer : false,
            seller : false,
            formError: false,
            errorMessage : ""
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
                    <Modal show={this.state.formError}>
                        <Modal.Header closeButton>
                            <Modal.Title>Sign Up Failed</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>{this.state.errorMessage}</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>{this.setState({formError:false})}}>Close</Button>
                        </Modal.Footer>
                    </Modal>

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

                                    <Form.Group as={Col} controlId="formGridZip" >
                                    <Form.Label>PostCode</Form.Label>
                                    <Form.Control ref={this.postCode} />
                                    </Form.Group>
                                </Form.Row>

                                {this.formCheckbox()}

                                <Form.Text className="text-muted" style={{textAlign:"right"}}>
                                        <a href="/login">Already have an account?</a>
                                </Form.Text>
                            </Form>
                            <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handleSubmit()}}>
                                Submit
                            </Button>
                        </Card.Body>
                    </Card>
                </>
            );
        }
    }

    handleSubmit(){

        if((this.password1.current.value) !== (this.password2.current.value)){
            this.setState({formError: true, errorMessage : "Your entered passwords do not match"});
            return;
        }

        if((this.password1.current.value).length === 0){
            this.setState({formError: true, errorMessage : "You cannot have an empty password"});
            return;
        }

        if((this.state.buyer) === (this.state.seller)){
            this.setState({formError: true, errorMessage :"You must specify if you are buying or selling a house"});
            return;
        }

        if(!((this.email.current.value).includes('@') && (this.email.current.value).includes('.com'))){
            this.setState({formError: true, errorMessage : "Your email format is incorrect, please verify your email address"});
            return;
        }

        if(((this.firstName.current.value).length === 0) || ((this.lastName.current.value).length === 0) || ((this.address1.current.value).length === 0) || ((this.city.current.value).length === 0) || ((this.postCode.current.value).length === 0) || ((this.phone.current.value).length === 0)){
            this.setState({formError: true, errorMessage: "A mandatory field is empty, please check your form"});
            return;
        }

        this.setState({
            loading : true,
        });        

        axios.defaults.baseURL = 'http://api.nono.fi:5000';

        axios.post('/signup', {
            firstname: this.firstName.current.value,
            lastname: this.lastName.current.value,
            email: this.email.current.value,
            phone: (this.phone.current.value === null ? "" : `${this.phone.current.value}`),
            password: this.password1.current.value,
            address_line_1: (this.address1.current.value === null ? "" : `${this.address1.current.value}`),
            address_line_2: (this.address2.current.value === null ? "" : `${this.address2.current.value}`),
            city: (this.city.current.value === null ? "" : `${this.city.current.value}`),
            state: (this.territory.current.value === null ? "" : `${this.territory.current.value}`),
            postcode: (this.postCode.current.value === null ? "" : `${this.postCode.current.value}`),
            bidder_flag: (this.state.buyer ? "1" : "0"),
            seller_flag: (this.state.seller ? "1" : "0")
        })
        .then((response) => {
            if (response.status === 200){
                this.cookies.set('authenticated',true,{path:'/'});
                this.cookies.set('token',response.data.token,{path:'/'});
                this.cookies.set('userType',response.data.user_type,{path:'/'});
                this.cookies.set('expireTime',response.data.expire_time,{path:'/'});
                this.setState({redirect : true});
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        return(
            <Container style={{marginTop:"2%"}}>
                {this.pageContent()}
            </Container>
        );
    }
}

export default SignUp;