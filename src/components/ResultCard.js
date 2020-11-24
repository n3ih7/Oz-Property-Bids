import React, {Component} from 'react';
import {Card, Container, Col, Row, Button} from 'react-bootstrap';
import RegistrationModal from '../components/RegistrationModal';
import bed from '../assets/bed.png';
import bath from '../assets/bathtub.png';
import car from '../assets/car.png';
import gavel from '../assets/gavel.png';
const axios = require('axios');

const leadingImageSpacingStyle = {marginRight:"5px"};
const ImageSpacingStyle = {marginRight:"5px", marginLeft: "20px"};
const ImageStyle = {width:"25px", height:"25px"};
const resultPageCard = {height:"260px", padding:"5px", color: "black"};
const frontPageCard = {height:"300px", width:"1000px", padding:"5px", color: "black"};

class ResultCard extends Component{

    constructor(props){
        super(props);

        this.state = {
            registered: (this.props.registeredAuctions.includes(this.props.propertyId) ? true : false),
            registerForAuction: false
        }

        this.redirectToProperty = this.redirectToProperty.bind(this);
        this.buyerCardFeatures = this.buyerCardFeatures.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.displayRegistered = this.displayRegistered.bind(this);
    }

    toggleModal(){
        this.setState({registerForAuction : !this.state.registerForAuction});
    }

    displayRegistered(){
        this.setState({registered : true});
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
                propertyDetails : Object.assign(response.data, {registered: this.state.registered})
            });
            
            this.props.givePropertyDetails(this.state.propertyDetails);
            this.props.checkRedirect(true);
            }
        }).catch((error) =>{
            console.log(error);
        });
    }

    buyerCardFeatures(){
        if(!this.props.bidderSummaryView){
            if ((this.props.userType === 'bidder') && ((new Date()) < new Date(parseInt(this.props.auctionStart)))){
                if(this.state.registered){
                    return(
                    <Col>
                        <Row className="justify-content-md-center" >
                            <Button style={{marginTop:"50%"}} variant="success" active>Registered</Button>
                        </Row>
                    </Col>
                    );
                }
                else{
                    return(
                    <Col>
                        <Row className="justify-content-md-center" >
                            <Button style={{background : "#05445E", borderColor: "#05445E", marginTop:"50%"}} onClick={() => {this.setState({registerForAuction: true})}}>Register!</Button>
                        </Row>
                    </Col>
                );
                }
            }
        }
    }

    render(){
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
                <Container>
                    <Card style={(this.props.front ? frontPageCard : resultPageCard)}>
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
                                    <Row>
                                        <h3>{this.props.introTitle}</h3>
                                    </Row>
                                    <br/>
                                    <Row style={{bottom:"40px", position:"absolute"}}>
                                        <div style ={leadingImageSpacingStyle}>{this.props.beds} </div> 
                                        <img src={bed} style={ImageStyle} alt="Beds"/>
                                        <div style ={ImageSpacingStyle}>{this.props.baths}</div> 
                                        <img src={bath} style={ImageStyle} alt="Baths"/>
                                        <div style ={ImageSpacingStyle}>{this.props.carSpots}</div> 
                                        <img src={car} style={ImageStyle} alt="Car Spots"/>
                                    </Row>
                                    <Row style={{bottom:"10px", position:"absolute"}}>
                                        <div style ={leadingImageSpacingStyle}>Auction Start</div>
                                        <div style={{paddingRight:"2px"}}> </div> 
                                        <img src={gavel} style={ImageStyle} alt="Auction Gavel"/> 
                                        <div style ={ImageSpacingStyle}>{(new Date(parseInt(this.props.auctionStart)).toString()).slice(0,24)}</div>
                                    </Row>
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