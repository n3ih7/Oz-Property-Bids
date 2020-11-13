import React, {Component} from 'react';
import {Container, Col, Row, Card} from 'react-bootstrap';
import AuctionManager from '../components/AuctionManager';
import Map from '../components/Map';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
const axios = require('axios');

class PropertyBid extends Component{
    constructor(props) {
        super(props);

        if(this.props.propertyDetails !== null){
            let currentTime = new Date();
            let givenStart =  new Date(parseInt(this.props.propertyDetails.auction_start));
            let givenEnd =  new Date(parseInt(this.props.propertyDetails.auction_end));
            let currentAuction = false;
            let afterAuction = false;

            if ((currentTime >= givenStart) && (currentTime < givenEnd)){
                currentAuction = true;
            }
            else if (currentTime >= givenEnd){
                afterAuction = true;
            }

            this.state = {
                propertyDetails : (this.props.propertyDetails != null) ? this.props.propertyDetails : false,
                pendingAuction: (currentAuction === afterAuction) ? true : false,
                activeAuction: (currentAuction) ? true : false,
                auctionComplete: (afterAuction) ? true : false,
                timeTillStart : givenStart,
                timeTillEnd : givenEnd,
                loading : true,
                haveMapDetails : false
            }

            localStorage.setItem('propertyBidState', JSON.stringify(this.state));
        }
        
        else{
            this.state = (JSON.parse(localStorage.getItem('propertyBidState')));
        }
        
    
        this.cookies = this.props.cookies;
        this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
    }

    saveStateToLocalStorage(){
        localStorage.setItem('propertyBidState', JSON.stringify(this.state));
    }

    refreshPropertyInfo(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
      
        axios.get('/property', {params:{
            id: this.state.propertyDetails.propertyId,
        }})
        .then((response) => {
            if (response.status === 200){
                this.setState({
                    propertyDetails : response.data
                });
                this.saveStateToLocalStorage();
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    render(){
        return(
            <>
            <Container fluid style ={{marginTop: "2%"}}>
                <Col md="auto">
                    <Row className="justify-content-md-center">
                        <Col>
                            <Card style={{width:"1100px", height:"800px", padding:"5px"}}>
                                <Card.Title style={{fontSize:"30px"}}>
                                    {this.state.propertyDetails.address}
                                </Card.Title>
                                <div>
                                    <Carousel>
                                        {this.state.propertyDetails.images.map(image =>(
                                            <div style={{width:"1000px", height:"100%"}}>
                                                <img alt="house picture" src={image}/>
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            </Card>
                        </Col>
                        <Col>
                            <AuctionManager 
                                pendingAuction={this.state.pendingAuction} 
                                activeAuction ={this.state.activeAuction} 
                                auctionComplete={this.state.auctionComplete}
                                timeStart = {this.state.timeTillStart}
                                timeEnd = {this.state.timeTillEnd}
                                propertyId = {this.state.propertyDetails.propertyId}
                                token = {this.cookies.get('token')}
                                userType = {this.cookies.get('userType')}
                                registered = {this.state.propertyDetails.registered}
                                acceptedPaymentMethods = {this.state.propertyDetails.accepted_payment_method}
                            />
                        </Col>
                    </Row>
                </Col>
            </Container>
            <Row className="justify-content-md-center" style={{marginTop:"50px", marginBottom:"50px"}}>
                    <Col md="auto">
                        <Card style={{width:"1800px", padding:"5px"}}>
                            <Card.Title style={{fontSize:"30px"}}>
                                {this.state.propertyDetails.intro_title}
                            </Card.Title>
                            <Card.Body>
                                <Row>
                                    Beds: {this.state.propertyDetails.beds+" "}
                                    Baths: {this.state.propertyDetails.baths+" "}
                                    Car Spots: {this.state.propertyDetails.parkingSpace+" "}
                                </Row>
                                <br/>
                                <Row>
                                    {this.state.propertyDetails.intro_text}
                                </Row>
                                <br/>
                                <Map
                                propertyId = {this.state.propertyDetails.propertyId}
                                propertyAddress = {this.state.propertyDetails.address}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default PropertyBid;