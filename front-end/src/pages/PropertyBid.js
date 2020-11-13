import React, {Component} from 'react';
import { Col, Row, Card, Spinner} from 'react-bootstrap';
import AuctionManager from '../components/AuctionManager';
import Map from '../components/Map';
import bed from '../assets/bed.png';
import bath from '../assets/bathtub.png';
import car from '../assets/car.png';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
const axios = require('axios');

const ImageStyle = {width:"25px", height:"25px", marginLeft:"5px", marginRight:"15px"};

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
                haveMapDetails : false,
                houseCenter: {
                    lat :59.95,
                    lng :30.33,
                  },
                services : [],
                refresh : false,
            }
            localStorage.clear();
            localStorage.setItem('propertyBidState', JSON.stringify(this.state));
        }

        else{
            this.state = (JSON.parse(localStorage.getItem('propertyBidState')));
        }
        
    
        this.cookies = this.props.cookies;
        this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
        this.checkRefresh = this.checkRefresh.bind(this);
        this.refreshPropertyInfo = this.refreshPropertyInfo.bind(this);
        this.getMapDetails = this.getMapDetails.bind(this);
    }

    saveStateToLocalStorage(){
        localStorage.setItem('propertyBidState', JSON.stringify(this.state));
    }


    getMapDetails(){
        if(!this.state.haveMapDetails){
    
            axios.defaults.baseURL = 'http://api.nono.fi:5000';
            axios.get('/mapinfo', {params:{
                id: this.state.propertyDetails.propertyId,
            }})
            .then((response) => {
                if (response.status === 200){
                    console.log(response.data);
                    
                    this.setState({
                      haveMapDetails : true,
                      houseCenter : response.data.property_location,
                      services : [
                        (response.data.hospital.location !== undefined) ? response.data.hospital : null,
                        (response.data.police.location !== undefined) ? response.data.police : null,
                        (response.data.school.location !== undefined) ? response.data.school : null,
                        (response.data.supermarket.location !== undefined) ? response.data.supermarket : null,
                        (response.data.university.location !== undefined) ? response.data.university : null
                      ],
                      loading : false
                    });

                    this.saveStateToLocalStorage();
                }
            }).catch((error) =>{
                console.log(error);
            });
        }
    }

    checkRefresh(refreshNow){
        this.setState({refresh: refreshNow});
    }

    refreshPropertyInfo(){
        if (this.state.refresh){
            axios.defaults.baseURL = 'http://api.nono.fi:5000';
            axios.get('/property', {params:{
                id: this.state.propertyDetails.propertyId,
            }})
            .then((response) => {
                if (response.status === 200){
                    console.log(response)
                    let currentTime = new Date();
                    let givenStart =  new Date(parseInt(response.data.auction_start));
                    let givenEnd =  new Date(parseInt(response.data.auction_end));
                    let currentAuction = false;
                    let afterAuction = false;

                    if ((currentTime >= givenStart) && (currentTime < givenEnd)){
                        currentAuction = true;
                    }
                    else if (currentTime >= givenEnd){
                        afterAuction = true;
                    }

                    this.setState({
                        propertyDetails : response.data,
                        pendingAuction: (currentAuction === afterAuction) ? true : false,
                        activeAuction: (currentAuction) ? true : false,
                        auctionComplete: (afterAuction) ? true : false,
                        timeTillStart : givenStart,
                        timeTillEnd : givenEnd,
                        refresh: false
                    });
                    this.saveStateToLocalStorage();
                    window.location.reload(false);
                }
            }).catch((error) =>{
                console.log(error);
            });
        }
    }

    render(){
        if (this.state.loading){
            return(
                <Row className="justify-content-md-center">
                    {this.getMapDetails()}
                    <Spinner animation="border" variant="light" role="status" style={{marginTop:"20%"}}></Spinner>
                </Row>
            );
        }
        else{
            return(
                <>
                {this.refreshPropertyInfo()}
                    <Row className="justify-content-md-center" style ={{marginTop: "1%"}}>
                        <Col md="auto">
                            <Row className="justify-content-md-center">
                                <Col>
                                    <Card style={{width:"900px", height:"810px", padding:"10px"}}>
                                        <Card.Title style={{fontSize:"30px"}}>
                                            {this.state.propertyDetails.address}
                                        </Card.Title>
                                        <div>
                                            <Carousel autoPlay axis="horizontal" infiniteLoop>
                                                {this.state.propertyDetails.images.map(image =>(
                                                    <div>
                                                        <img alt="house" src={image}/>
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
                                        givePropertyDetails={this.props.retrieveHouse}
                                        checkRefresh = {this.checkRefresh}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center" style={{marginTop:"50px", marginBottom:"50px"}}>
                        <Col md="auto">
                            <Card style={{width:"1800px", padding:"5px"}}>
                                <Card.Title style={{fontSize:"30px"}}>
                                    {this.state.propertyDetails.intro_title}
                                </Card.Title>
                                <Card.Body>
                                    <Row>
                                        {this.state.propertyDetails.beds+" "} <img style={ImageStyle} src={bed} alt="beds"/>
                                        {this.state.propertyDetails.baths+" "} <img style={ImageStyle} src={bath} alt="baths"/>
                                        {this.state.propertyDetails.parkingSpace+" "} <img style={ImageStyle} src={car} alt="cars"/>
                                    </Row>
                                    <br/>
                                    <Row>
                                        {this.state.propertyDetails.intro_text}
                                    </Row>
                                    <br/>
                                    <Map
                                    propertyId = {this.state.propertyDetails.propertyId}
                                    propertyAddress = {this.state.propertyDetails.address}
                                    mapHasLoaded = {this.state.mapHasLoaded}
                                    houseCenter ={this.state.houseCenter}
                                    services = {this.state.services}
                                    haveMapDetails = {this.state.haveMapDetails}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            );
        } 
        }
    }


export default PropertyBid;