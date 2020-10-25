import React, {Component} from 'react';
import {Container, Card, Form, Col, Row, Button} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class SellerHome extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            listings : null,
        }
    
        this.cookies = this.props.cookies;
        this.currentListings = this.currentListings.bind(this);
    }

    currentListings(){
        //API Call to get current listings
        if (this.state.listings != null && this.state.listings != 0){
            //Display listings as Result Cards
            return(
            <>
            </>
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
        return(
            <>
                {this.currentListings()}
            </>
        );
    }
}

export default SellerHome;