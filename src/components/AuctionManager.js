import React, {Component} from 'react';
import { Accordion, Card, Col, Row, Button, Spinner} from 'react-bootstrap';
import RegistrationModal from '../components/RegistrationModal';
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
            tryVerifyBidder : false,
        }

        this.timer = null;

        this.verifyRAB = this.verifyRAB.bind(this);
        this.getBidList = this.getBidList.bind(this);
        this.bid = this.bid.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.displayRegistered = this.displayRegistered.bind(this);
        this.buyerCardFeatures = this.buyerCardFeatures.bind(this);
        this.getLatestBids = this.getLatestBids.bind(this);
        this.refreshComponent = this.refreshComponent.bind(this);
    }

    toggleModal(){
        this.setState({registerForAuction : !this.state.registerForAuction});
    }

    displayRegistered(){
        this.setState({registered : true});
    }

    refreshComponent(){
        this.props.checkRefresh(true);
        this.forceUpdate();
        window.location.reload(true);
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
                this.getBidList();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getBidList(){
        console.log('Updating Bids');
        this.timer = null;
        if(this.props.userType !== 'bidder'){
            this.setState({loading : false});
        }

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
                    highestBid : (response.data.history.length !== 0) ? (response.data.history[0]).offerPrice : "0",
                    loading : false,
                    timeTillEnd: new Date(parseInt(response.data.end_time))
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    getLatestBids(){
        if(this.timer === null){
            this.timer = setTimeout(() => this.getBidList(), 5000);
        }
    }
    
    verifyRAB(){
        if(this.state.registered){
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
        if(this.state.pendingAuction){
            return(
                <>
                    <RegistrationModal
                        registerForAuction = {this.state.registerForAuction}
                        toggleModal = {this.toggleModal}
                        displayRegistered = {this.displayRegistered}
                        propertyId = {this.props.propertyId}
                        token = {this.props.token}
                        acceptedPaymentMethods = {this.props.acceptedPaymentMethods}
                     />

                    <Card style={{width:"22rem", padding:"5px"}}>
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <h2 >Time Till Auction</h2>
                            </Row>
                            <Row className="justify-content-md-center">
                                <Countdown className ="timerFormat" date={this.state.timeTillStart} onComplete={() => {this.refreshComponent()}}></Countdown>
                            </Row>
                            <br/>
                            <Row className="justify-content-md-center">
                                 <h6>Auction Started: {new Date((this.state.timeTillStart)).toString().slice(4,21)}</h6>
                                 <h6>Auction Ends: {new Date((this.state.timeTillEnd)).toString().slice(4,21)}</h6>
                            </Row>
                            <br/>
                            {this.buyerCardFeatures()}
                        </Col>
                    </Card>
                </>
            );
        }
        
        else if(this.state.activeAuction ){
            if (this.state.loading){
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
                        {this.getLatestBids()}
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <h2>Current Winning Bid</h2>
                            </Row>
                            
                            <Row className="justify-content-md-center">
                                <h2>${this.state.highestBid}</h2>
                            </Row>
                            <br/>
                            <Row className="justify-content-md-center">
                                <Countdown className ="timerFormat" date={this.state.timeTillEnd} onComplete={()=> {this.refreshComponent()}}></Countdown>
                            </Row>
                            <br/>
                            <Row className="justify-content-md-center">
                                 <h6>Auction Started: {new Date((this.state.timeTillStart)).toString().slice(4,21)}</h6>
                                 <h6>Auction Ends: {new Date((this.state.timeTillEnd)).toString().slice(4,21)}</h6>
                            </Row>
                            <br/>
                            {this.verifyRAB()}
                            <Row className="justify-content-md-center">
                                <Accordion defaultActiveKey="1">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} onClick={()=>{this.getBidList()}} eventKey="0">
                                            <div style={{textAlign:"center"}}>Total Bids - {this.state.bidHistory.length}</div>
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
        else if(this.state.auctionComplete){
            if (this.state.loading){
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
                                <h2>Final Bid</h2>
                            </Row>
                            
                            <Row className="justify-content-md-center">
                                <h2>${this.state.highestBid}</h2>
                            </Row>
                            <br/>
                            <Row className="justify-content-md-center">
                                 <h6>Auction Started: {new Date((this.state.timeTillStart)).toString().slice(4,21)}</h6>
                                 <h6>Auction Ended: {new Date((this.state.timeTillEnd)).toString().slice(4,21)}</h6>
                            </Row>
                            <br/>
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
            );
        }

        
    }
}
export default AuctionManager;