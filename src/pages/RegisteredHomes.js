import React, {Component} from 'react';
import {Container, Row, Spinner} from 'react-bootstrap';
import ResultCard from '../components/ResultCard';
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class RegisteredHomes extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            listings : [],
            listingIds: null,
            redirect : false,
            gotListingIds: false,
            gotListings: false
        }
    
        this.cookies = this.props.cookies;
        this.pageContent = this.pageContent.bind(this);
        this.getBidderListings = this.getBidderListings.bind(this);
        this.getBidderListingIds = this.getBidderListingIds.bind(this);
        this.checkRedirect = this.checkRedirect.bind(this);
    }

    checkRedirect(redirectNow){
        this.setState({redirect: redirectNow});
    }

    getBidderListingIds(){
        if(!this.state.gotListingIds){
        
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.get('/get_rab_status')
        .then((response) => {
            if(response.status === 200){
                this.setState({
                    listingIds : response.data.rab_registered,
                    gotListingIds: true
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
        }
    }

    getBidderListings(){
        if(!this.state.gotListings && this.state.gotListingIds){

            let tempListingsArray = [];
            
            for(let i = 0; i < this.state.listingIds.length; i++){
                axios.defaults.baseURL = 'http://api.nono.fi:5000';
                axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

                axios.get('/property', {params:{
                    id: this.state.listingIds[i],
                }})
                .then((response) => {
                    if(response.status === 200){
                        tempListingsArray.push(response.data);
                        this.setState({listings: tempListingsArray});
                    }
                }).catch((error) =>{
                    console.log(error);
                });
            }

            this.setState({gotListings : true});
            console.log(tempListingsArray);
        }
    }
    
    pageContent(){
        if (this.state.loading){
            
            return(
                <Row className="justify-content-md-center">
                    <Spinner animation="border" variant="light" role="status" style={{marginTop:"20%"}}></Spinner>
                </Row>
            );
        }
        else if (this.state.gotListings){
            if ((this.state.listings.length !== 0)){
                return(
                    <Container style={{marginTop: "5%"}}>
                        <h1 style={{color:"white"}}>Registered Auctions</h1>
                        <br/>
                        {this.state.listings.map(property =>(
                            <>
                                <Row>
                                    <ResultCard 
                                    streetAddress={property.address} 
                                    auctionStart ={property.auction_start} 
                                    baths={property.baths} beds={property.beds} 
                                    city={property.city} 
                                    propertyType ={property.propertyType} 
                                    carSpots={property.parkingSpace} 
                                    image={property.images[0]} 
                                    propertyId={property.propertyId} 
                                    givePropertyDetails={this.props.retrieveHouse} 
                                    checkRedirect = {this.checkRedirect} 
                                    token={this.cookies.get('token')} 
                                    userType={this.cookies.get('userType')}
                                    registeredAuctions = {[property.propertyId]}
                                    bidderSummaryView = {true}
                                    acceptedPaymentMethods = {property.accepted_payment_method}
                                    />
                                </Row>
                                <br/>
                            </>
                        ))}
                    </Container>
                );
            }
            else{
                return(
                    <Container style={{marginTop: "5%"}}>
                        <h1 style={{color:"white"}}>Registered Auctions</h1>
                        <br/>
                        <h4 style={{color:"white", textAlign:""}}>Looks like there's nothing here yet...</h4>
                        <p style={{color:"white", textAlign:""}}>Property auctions you've registered for will be listed here</p>
                    </Container>
                );
            }
        }
    }
    
    render(){
        if (this.state.redirect){
            return(
            <>
                <Redirect to="/house"/>
            </>
            );
        }
        else{
            return(
                <>
                    {this.getBidderListingIds()}
                    {this.getBidderListings()}
                    {this.pageContent()}
                </>
            );
        }
    }
}

export default RegisteredHomes;