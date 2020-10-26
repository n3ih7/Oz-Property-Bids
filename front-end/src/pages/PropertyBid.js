import React, {Component} from 'react';
import {Container, Jumbotron, Form, Col, Row, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import AuctionManager from '../components/AuctionManager'
const axios = require('axios');

class PropertyBid extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          
        }
    
        this.cookies = this.props.cookies;
    }

    render(){
        return(
            <Container>
                <AuctionManager/>
            </Container>
        );
    }
}

export default PropertyBid;