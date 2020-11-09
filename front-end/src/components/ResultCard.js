import React, {Component} from 'react';
import {Card, Container, Col, Row, Button, Modal, Accordion, Form} from 'react-bootstrap';
import './ResultCard.css';
const axios = require('axios');

class ResultCard extends Component{

    constructor(props){
        super(props);
        this.state = {
            registered: false,
            registerForAuction: false,
            payWithCard: false,
            payWithBank: false,
            payWithCheque: false,
            cardHolderName : "",
            cardNumber: "",
            cardExpiration:"",
            cardCV:"",
            chequeName:"",
            bankName:"",
            accountNum:"",
            paymentMethod: "",
            initialBid: ""
        }

        this.redirectToProperty = this.redirectToProperty.bind(this);
        this.registerForAuction = this.registerForAuction.bind(this);
        this.buyerCardFeatures = this.buyerCardFeatures.bind(this);
    }

    registerForAuction(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.props.token}`;

        axios.post('/bid', {
            id: this.props.propertyId,
            offerPrice: this.state.initialBid,
            paymentMethod : this.state.paymentMethod,
            cardHolderName : this.state.cardHolderName,
            cardNumber: this.state.cardNumber,
            cardExpiration: this.state.cardExpiration,
            cardCV: this.state.cardCV,
            chequeName: this.state.chequeName,
            bankName: this.state.bankName,
            accountNum: this.stateaccountNum
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({registered:true, registerForAuction:false});
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    redirectToProperty(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
      
        axios.get('/property', {params:{
        id: this.props.propertyId,
        }})
        .then((response) => {
            if (response.status === 200){
            this.setState({
                redirect : true,
                propertyDetails : response.data
            });
            this.props.givePropertyDetails(this.state.propertyDetails);
            this.props.checkRedirect(true);
            }
        }).catch((error) =>{
            console.log(error);
        });
    }
    

    buyerCardFeatures(){
        if (this.props.userType === 'bidder'){
            if(this.state.registered){
                return(
                <Col>
                    <Row className="justify-content-md-center" >
                        <Button style={{marginTop:"25%"}} variant="success" active>Registered</Button>
                    </Row>
                </Col>
                );
            }
            else{
                return(
                <Col>
                    <Row className="justify-content-md-center" >
                        <Button style={{background : "#05445E", borderColor: "#05445E", marginTop:"25%"}} onClick={() => {this.setState({registerForAuction: true})}}>Register!</Button>
                    </Row>
                </Col>
             );
            }
        }
    }

    render(){
        return(
            <>
                <Modal show={this.state.registerForAuction}>
                    <Modal.Header closeButton onClick= {()=>{this.setState({registerForAuction:false})}}>
                        <Modal.Title>Let's get ready for an Auction!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>You must place an initial bid in order to register for the full auction.</p>
                        <p>The payment methods available are limited to the options the property seller will accept.</p>
                        <div>
                            <Form.Check inline label="Credit Card" type='radio' id={`card`} checked={this.state.payWithCard} onClick={()=>{this.setState({payWithCard: !this.state.payWithCard, payWithBank: false, payWithCheque: false, paymentMethod: '0'})}} />
                            <Form.Check inline label="Bank Transfer" type='radio' id={`bankTransfer`} checked={this.state.payWithBank} onClick={()=>{this.setState({payWithBank: !this.state.payWithBank, payWithCard: false, payWithCheque: false, paymentMethod:"1"})}} />
                            <Form.Check inline label="Cheque" type='radio' id={`cheque`} checked={this.state.payWithCheque} onClick={()=>{this.setState({payWithCheque: !this.state.payWithCheque, payWithCard: false, payWithBank: false, paymentMethod:"2"})}}/>
                        </div>
                        <Accordion activeKey = {this.state.paymentMethod}>
                            <Card>
                                <Card.Header>
                                <Accordion.Toggle as={Row} eventKey="0">
                                    <div style={{padding:"1px"}}></div>
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    Credit Card Details
                                    <Form>
                                        <br/>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="formGridCardName">
                                                <Form.Control type="" placeholder="Card Holder Name" value={this.state.cardHolderName} onChange ={(e)=>{this.setState({cardHolderName:e.target.value})}} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="formGridCardNumber">
                                                <Form.Control type="" placeholder="Card Number" value={this.state.cardNumber} onChange ={(e)=>{this.setState({cardNumber:e.target.value})}} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="formGridCardExpiration">
                                                <Form.Control type="" placeholder="Expiration: mm/yy" value={this.state.cardExpiration} onChange ={(e)=>{this.setState({cardExpiration:e.target.value})}} />
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="formGridCardCV">
                                                <Form.Control type="password" placeholder="CV" value={this.state.cardCV} onChange ={(e)=>{this.setState({cardCV :e.target.value})}} />
                                            </Form.Group>
                                        </Form.Row>
                                    </Form>
                                    <br/>
                                    <Row className="justify-content-md-center">
                                        <input className="calendar" placeholder="$ Amount" value={this.state.initialBid} onChange={(e)=>{this.setState({initialBid: e.target.value})}}></input>
                                        <Button onClick ={()=>{this.registerForAuction()}}>Bid</Button>
                                    </Row>
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Row}  eventKey="1">
                                        <div style={{padding:"1px"}}></div>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        Your BSB and Account Number provided on account sign up will be used. If you would prefer a different bank account to be used, please change this information on your <a href="/account">profile page</a>.
                                        
                                        <Row className="justify-content-md-center">
                                            <input className="calendar" placeholder="$ Amount" value={this.state.initialBid} onChange={(e)=>{this.setState({initialBid: e.target.value})}}></input>
                                            <Button onClick ={()=>{this.registerForAuction()}}>Bid</Button>
                                        </Row>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                        <Accordion.Toggle as={Row}  eventKey="2">
                                            <div style={{padding:"1px"}}></div>
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    Cheque Details
                                    <Form>
                                        <br/>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="formGridChequeName">
                                                <Form.Control type="" placeholder="Name Signed on Cheque" value={this.state.chequeName} onChange ={(e)=>{this.setState({chequeName :e.target.value})}} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="formGridChequeBank">
                                                <Form.Control type="" placeholder="Name of Bank" value={this.state.bankName} onChange ={(e)=>{this.setState({bankName :e.target.value})}}/>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="formGridChequeAccount">
                                                <Form.Control type="" placeholder="Account Number" value={this.state.accountNum} onChange ={(e)=>{this.setState({accountNum :e.target.value})}}/>
                                            </Form.Group>
                                        </Form.Row>
                                    </Form>
                                    <br/>
                                    <Row className="justify-content-md-center">
                                        <input className="calendar" placeholder="$ Amount" value={this.state.initialBid} onChange={(e)=>{this.setState({initialBid: e.target.value})}}></input>
                                        <Button onClick ={()=>{this.registerForAuction()}}>Bid</Button>
                                    </Row>
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{this.setState({registerForAuction:false})}}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Container>
                    <Card fluid style={{height:"260px", padding:"5px"}}>
                        <Row>
                            <Col md="auto" onClick ={() => this.redirectToProperty()}>
                                <Card.Img  variant = "left" src={this.props.image} alt="House Image" style={{height:"250px", width:"300px"}}/>
                            </Col>
                            <Col xs={6} onClick ={() => this.redirectToProperty()}>
                                <Card.Title>
                                    {this.props.streetAddress}
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{this.props.propertyType}</Card.Subtitle>
                                <Card.Body>
                                        Beds: {this.props.beds}
                                        <br/>
                                        Baths: {this.props.baths}
                                        <br/>
                                        Car Spots: {this.props.carSpots}
                                        <br/>
                                        Auction Start: {(new Date(parseInt(this.props.auctionStart)).toString()).slice(0,24)}
                                </Card.Body>
                            </Col>
                            {this.buyerCardFeatures()}
                        </Row>
                    </Card>
                </Container>
            </>
        );
    }
}

export default ResultCard;