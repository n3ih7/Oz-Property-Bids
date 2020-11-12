import React, {Component} from 'react';
import {Card, Col, Row, Button, Modal, Accordion, Form} from 'react-bootstrap';
const axios = require('axios');

class RegisterationModal extends Component{
    constructor(props){
        super(props);

        this.state = {
            payWithCard: false,
            payWithBank: false,
            payWithCheque: false,
            cardHolderName : "",
            cardNumber: "",
            cardExpiration:"",
            cardCV:"",
            bankName:"",
            accountNum:"",
            paymentMethod: "",
            initialBid: "",
            paymentOptions : ["card", "bank", "cheque"]
        }
        this.registerForAuction = this.registerForAuction.bind(this);
    }

    registerForAuction(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.props.token}`;

        axios.post('/bid', {
            id: this.props.propertyId,
            offerPrice: this.state.initialBid,
            paymentMethod : this.state.paymentOptions[parseInt(this.state.paymentMethod)],
            cardHolderName : this.state.cardHolderName,
            cardNumber: this.state.cardNumber,
            cardExpiration: this.state.cardExpiration,
            cardCV: this.state.cardCV,
            bankName: this.state.bankName,
            accountNum: this.state.accountNum
        })
        .then((response) => {
            if (response.status === 200){
                this.props.displayRegistered();
                this.props.toggleModal();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        return(
            <Modal show={this.props.registerForAuction}>
                <Modal.Header closeButton onClick= {()=>{this.props.toggleModal()}}>
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
                                    <div>
                                    Please enter the BSB and Account Number from the account you will be making the purchase from. This is merely a security precaution.
                                    <br/>
                                    The owner of the property's bank details will be shared with you if you win at Auction.
                                    </div>
                                    <br/>
                                <Form.Row>
                                        <Form.Group as={Col} controlId="formGridBSB">
                                            <Form.Control type="" placeholder="BSB" value={this.state.bsb} onChange ={(e)=>{this.setState({bsb :e.target.value})}}/>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridChequeAccount">
                                            <Form.Control type="" placeholder="Account Number" value={this.state.accountNum} onChange ={(e)=>{this.setState({accountNum :e.target.value})}}/>
                                        </Form.Group>
                                    </Form.Row>

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
                                <div>The seller information regarding writing a cheque will be shared with you if you win the auction.</div>
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
                    <Button variant="secondary" onClick={()=>{this.props.toggleModal()}}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RegisterationModal;