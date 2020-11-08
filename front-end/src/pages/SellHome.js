import React, {Component} from 'react';
import {Container, Button, Row} from 'react-bootstrap';
import ResultCard from '../components/ResultCard';
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class SellerHome extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            listings : null,
            redirect : false,
            gotListings: false
        }
    
        this.cookies = this.props.cookies;
        this.pageContent = this.pageContent.bind(this);
        this.getSellerListings = this.getSellerListings.bind(this);
        this.checkRedirect = this.checkRedirect.bind(this);
    }

    checkRedirect(redirectNow){
        this.setState({redirect: redirectNow});
    }

    getSellerListings(){
        if(!this.state.gotListings){
        
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.get('/mylisting')
        .then((response) => {
            console.log(response);
            if(response.status === 200){
                this.setState({
                    listings : response.data.listing,
                    gotListings: true
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
        }
    }
    
    pageContent(){
        if ((this.state.listings !== null) && (this.state.listings.length !== 0)){
            return(
                <Container style={{marginTop: "5%"}}>
                    <h1 style={{color:"white"}}>Current Listings</h1>
                    <br/>
                    {this.state.listings.map(property =>(
                        <>
                            <Row>
                                <ResultCard streetAddress={property.address} auctionStart ={property.auction_start} baths={property.baths} beds={property.beds} city={property.city} propertyType ={property.propertyType} carSpots={property.parkingSpace} image={property.images[0]} propertyId={property.propertyId} givePropertyDetails={this.props.retrieveHouse} checkRedirect = {this.checkRedirect} token={this.cookies.get('token')} userType={this.cookies.get('userType')}/>
                            </Row>
                            <br/>
                        </>
                    ))}
                    <Button style={{background : "#05445E", borderColor: "white"}} href="/upload">Upload another listing!</Button>
                </Container>
            );
        }
        else{
            return(
                <Container style={{marginTop: "5%"}}>
                    <h1 style={{color:"white"}}>Current Listings</h1>
                    <br/>

                    <h4 style={{color:"white", textAlign:""}}>Looks like there's nothing here yet...</h4>
                    <Button style={{background : "#05445E", borderColor: "white"}} href="/upload">Upload your first property listing!</Button>
                </Container>
            );
        }

    }
    
    render(){
        if (this.state.redirect === true){
            return(
            <>
                <Redirect to="/house"/>
            </>
            );
        }
        else{
            return(
                <>
                    {this.getSellerListings()}
                    {this.pageContent()}
                </>
            );
        }
    }
}

export default SellerHome;