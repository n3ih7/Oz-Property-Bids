import React, {Component} from 'react';
import {Container, Accordion, Card, Col, Row, Button} from 'react-bootstrap';
import Countdown from 'react-countdown';
import './AuctionManager.css';
const axios = require('axios');

class AuctionManager extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            pendingAuction: !this.props.pendingAuction,
            activeAuction: !this.props.activeAuction,
            auctionComplete: this.props.auctionComplete,
            timeTillStart : this.props.timeStart,
            timeTillEnd : this.props.timeEnd,
            highestBid : 50000,
            bidHistory : [5000,12000,12000,12000,12000,12000,12000,12000,12000,12000,12000,80000]
        }

        console.log(this.props.timeStart);

        this.verifyRAB = this.verifyRAB.bind(this);
    }

    verifyRAB(){
        //call api to check
        if(1 === 1){
            return(
                <>
                    <Row className="justify-content-md-center">
                        <input className="calendar"></input>
                        <Button>Bid</Button>
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
                            <Button style={{backgroundColor:"#05445E"}}>Register!</Button>
                        </Row>
                    </Col>
                </Card>
            );
        }
        
        else if(this.state.activeAuction === true){
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
                                    <Accordion.Toggle as={Card.Header} eventKey="0">
                                        Bidding History
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            {this.state.bidHistory.map(bid =>(
                                                <>
                                                    <Row className="justify-content-md-center" style={{borderBottom:"1px solid"}}>
                                                        ${bid}
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
        else if(this.state.auctionComplete === true){
            return(
                <Container>
                    {/* <Row>
                        <Col md="auto">
                            <Row style={{alignItems:"center", display:"flex"}}>
                                <h2 style={{color:"white"}}>Time Till Auction</h2>
                            </Row>
                            <Row>
    
                            </Row>
                            <Row>
                                <Countdown className ="timerFormat" date={this.state.timeTillStart}></Countdown>
                            </Row>
                        </Col>
                    </Row> */}
                </Container>
            );
        }
        else{
            return(
                <h5>An error has occured, please contact your network admin</h5> 
            ); //fyi this is a joke
        }

        
    }
}
export default AuctionManager;