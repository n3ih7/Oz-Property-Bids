import React, {Component} from 'react';
import {Container, Col, Row, Card} from 'react-bootstrap';
import AuctionManager from '../components/AuctionManager'
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
const axios = require('axios');

class PropertyBid extends Component{
    constructor(props) {
        super(props);
        
        let currentTime = new Date();
        let givenStart = new Date(parseInt(this.props.propertyDetails.auction_start));
        let givenEnd =  new Date(parseInt(this.props.propertyDetails.auction_end))
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
            loading : true
        }
    
        this.cookies = this.props.cookies;
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
                            <Card style={{width:"1300px", padding:"5px"}}>
                                <Card.Title style={{fontSize:"30px"}}>
                                    {this.state.propertyDetails.address}
                                </Card.Title>
                                <Carousel>
                                    {this.state.propertyDetails.images.map(image =>(
                                        <div style={{width:"1000px"}}>
                                            <img alt="favourites button" src={image}/>
                                        </div>
                                    ))}
                                </Carousel>
                            </Card>
                        </Col>
                        <Col>
                            <AuctionManager 
                                pendingAuction={this.state.pendingAuction} 
                                activeAuction ={this.state.activeAuction} 
                                auctionComplete={this.state.auctionComplete}
                                timeStart = {this.state.timeTillStart}
                                timeEnd = {this.state.timeTillEnd}
                                propertyId = {this.props.propertyDetails.propertyId}
                                token = {this.cookies.get('token')}
                                userType = {this.cookies.get('userType')}
                                registered = {this.props.propertyDetails.registered}
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
                                <Row>
                                    <Col>
                                    Map Stats Go Here
                                    </Col>
                                    <Col>
                                    Google Map Goes Here
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default PropertyBid;