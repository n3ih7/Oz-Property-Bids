import React, {Component} from 'react';
import {Container, Accordion, Card, Col, Row, Button, Spinner} from 'react-bootstrap';
import Countdown from 'react-countdown';
import './AuctionManager.css';
const axios = require('axios');

class AuctionManager extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            pendingAuction: this.props.pendingAuction,
            activeAuction: this.props.activeAuction,
            auctionComplete: this.props.auctionComplete,
            timeTillStart : this.props.timeStart,
            timeTillEnd : this.props.timeEnd,
            highestBid : 0,
            bidHistory : [],
            newBidValue : null,
            loading : true
        }

        this.verifyRAB = this.verifyRAB.bind(this);
        this.getBidList = this.getBidList.bind(this);
        this.bid = this.bid.bind(this);
        this.registerForAuction = this.registerForAuction.bind(this);
    }

    registerForAuction(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.props.token}`;

        axios.post('/bid', {
            id: this.props.propertyId,
            offerPrice: "100",
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
                <Card style={{width:"22rem", padding:"5px"}}>
                    <Col md="auto">
                        <Row className="justify-content-md-center">
                            <h2 >Time Till Auction</h2>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Countdown className ="timerFormat" date={this.state.timeTillStart}></Countdown>
                        </Row>
                        <br/>
                        <Row className="justify-content-md-center">
                            <Button style={{backgroundColor:"#05445E"}} onClick ={()=>{this.registerForAuction()}}>Register!</Button>
                        </Row>
                    </Col>
                </Card>
            );
        }
        
        else if(this.state.activeAuction === true){
            if (this.state.loading == true){
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
            if (this.state.loading == true){
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