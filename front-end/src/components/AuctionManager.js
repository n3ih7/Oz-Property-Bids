import React, {Component} from 'react';
import { Accordion, Card, Col, Row, Button, Spinner, Modal, Form} from 'react-bootstrap';
import Countdown from 'react-countdown';
import './AuctionManager.css';
const axios = require('axios');

class AuctionManager extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            registered: this.props.registered,
            registerForAuction: false,
            pendingAuction: this.props.pendingAuction,
            activeAuction: this.props.activeAuction,
            auctionComplete: this.props.auctionComplete,
            timeTillStart : this.props.timeStart,
            timeTillEnd : this.props.timeEnd,
            highestBid : 0,
            bidHistory : [],
            newBidValue : null,
            loading : true,
            tryVerifyBidder : false
        }

        console.log(this.props.registered);

        this.verifyRAB = this.verifyRAB.bind(this);
        this.getBidList = this.getBidList.bind(this);
        this.bid = this.bid.bind(this);
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

    buyerCardFeatures(){
        if ((this.props.userType === 'bidder') && (this.state.pendingAuction)){
            if(this.state.registered){
                return(
                <Col>
                    <Row className="justify-content-md-center" >
                        <Button variant="success" active>Registered</Button>
                    </Row>
                </Col>
                );
            }
            else{
                return(
                <Col>
                    <Row className="justify-content-md-center" >
                        <Button onClick={() => {this.setState({registerForAuction: true})}}>Register!</Button>
                    </Row>
                </Col>
             );
            }
        }
    }

    bid(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.props.token}`;
  
        axios.post('/bid', {
            id: this.props.propertyId,
            offerPrice: this.state.newBidValue
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                this.setState({redirect :true});
                this.getBidList();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getBidList(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.props.token}`;

      
        axios.get('/bid', {params:{
            id: this.props.propertyId,
        }})
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                this.setState({
                    bidHistory : response.data.history.reverse(),
                    highestBid : (response.data.history[0]).offerPrice,
                    loading : false
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
    }
    
    verifyRAB(){
        //call api to check
        if(1 === 1){
            return(
                <>
                    <Row className="justify-content-md-center">
                        <input className="calendar" value={this.state.newBidValue} onChange={(e)=>{this.setState({newBidValue: e.target.value})}}></input>
                        <Button onClick ={()=>{this.bid()}}>Bid</Button>
                    </Row>
                    <br/>
                </>     
            )
        }
    }

    render(){
        if(this.state.pendingAuction === true){
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

                    <Card style={{width:"22rem", padding:"5px"}}>
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <h2 >Time Till Auction</h2>
                            </Row>
                            <Row className="justify-content-md-center">
                                <Countdown className ="timerFormat" date={this.state.timeTillStart}></Countdown>
                            </Row>
                            <br/>
                            {this.buyerCardFeatures()}
                        </Col>
                    </Card>
                </>
            );
        }
        
        else if(this.state.activeAuction === true){
            if (this.state.loading === true){
                return(
                    <Row className="justify-content-md-center">
                            <Spinner animation="border" role="status" variant="light"></Spinner>
                            {this.getBidList()}
                    </Row>
                );
            }
            else{
                return(
                    <Card style={{width:"22rem", padding:"5px"}}>
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <h2>Current Winning Bid</h2>
                            </Row>
                            
                            <Row className="justify-content-md-center">
                                <h2>${this.state.highestBid}</h2>
                            </Row>
                            <br/>
                            <Row className="justify-content-md-center">
                                <Countdown className ="timerFormat" date={this.state.timeTillEnd}></Countdown>
                            </Row>
                            <br/>
                            {this.verifyRAB()}
                            <Row className="justify-content-md-center">
                                <Accordion defaultActiveKey="1">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} onClick={()=>{this.getBidList()}} eventKey="0">
                                            Bidding History
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {this.state.bidHistory.map(bid =>(
                                                    <>
                                                        <Row className="justify-content-md-center" style={{borderBottom:"1px solid"}}>
                                                        {bid.bidder_name} : ${bid.offerPrice}
                                                        </Row>
                                                        <br/>
                                                    </>
                                                ))}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Row>
                        </Col>
                    </Card>
                );
            }
        }
        else if(this.state.auctionComplete === true){
            if (this.state.loading === true){
                return(
                    <Row className="justify-content-md-center">
                            <Spinner animation="border" role="status" variant="light"></Spinner>
                            {this.getBidList()}
                    </Row>
                );
            }
            else{
                return(
                    <Card style={{width:"22rem", padding:"5px"}}>
                            <Col md="auto">
                                <Row className="justify-content-md-center">
                                    <h2>Last Winning Bid</h2>
                                </Row>
                                
                                <Row className="justify-content-md-center">
                                    <h2>${this.state.highestBid}</h2>
                                </Row>
                                <br/>
                                {/* <Row className="justify-content-md-center">
                                    <Countdown className ="timerFormat" date={this.state.timeTillEnd}></Countdown>
                                </Row>
                                <br/> */}
                                <Row className="justify-content-md-center">
                                    <Accordion defaultActiveKey="1">
                                        <Card>
                                            <Accordion.Toggle as={Card.Header} onClick={()=>{this.getBidList()}} eventKey="0">
                                                Bidding History
                                            </Accordion.Toggle>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    {this.state.bidHistory.map(bid =>(
                                                        <>
                                                            <Row className="justify-content-md-center" style={{borderBottom:"1px solid"}}>
                                                            {bid.bidder_name} : ${bid.offerPrice}
                                                            </Row>
                                                            <br/>
                                                        </>
                                                    ))}
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </Row>
                            </Col>
                        </Card>
                );
            }
        }
        else{
            return(
                <h5>An error has occured, please contact your network admin</h5> 
            ); //fyi this is a joke
        }

        
    }
}
export default AuctionManager;