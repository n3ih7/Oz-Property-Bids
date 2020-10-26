import React, {Component} from 'react';
import {Container, Accordion, Form, Col, Row, Button} from 'react-bootstrap';
import Countdown from 'react-countdown';
import './AuctionManager.css';
const axios = require('axios');

class AuctionManager extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            pendingAuction: !true,
            activeAuction: !false,
            auctionComplete: false,
            timeTillStart : Date.now() + 1000*60,
            timeTillEnd : null,
            highestBid : 50000,
            bidHistory : []
        }
    }

    render(){
        if(this.state.pendingAuction === true){
            return(
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <h2 style={{color:"white", marginLeft:"12.5%"}}>Time Till Auction</h2>
                            </Row>
                            <Row>
    
                            </Row>
                            <Row>
                                <Countdown className ="timerFormat" date={this.state.timeTillStart}></Countdown>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            );
        }
        
        else if(this.state.activeAuction === true){
            return(
                <Container>
                    
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <h2 style={{color:"white"}}>Current Winning Bid: ${this.state.highestBid}</h2>
                            </Row>
                            <Row className="justify-content-md-center">
    
                            </Row>
                            <Row className="justify-content-md-center">
                                <Countdown className ="timerFormat" date={this.state.timeTillStart}></Countdown>
                            </Row>
                        </Col>
                    
                </Container>
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