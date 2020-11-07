import React, {Component} from 'react';
import {Card, Container, Col, Row, Button} from 'react-bootstrap';
import emptyStar from "../assets/empty_star.png";
import halfStar from "../assets/hover_star.png";
import fullStar from "../assets/full_star.png";
import './ResultCard.css';
const axios = require('axios');

class ResultCard extends Component{

    constructor(props){
        super(props);
        this.state = {
            starImage : emptyStar,
            addedToFav: false
        }


        this.toggleFavorites = this.toggleFavorites.bind(this);
        this.hoverFavorites = this.hoverFavorites.bind(this);
        this.redirectToProperty = this.redirectToProperty.bind(this);
        this.registerForAuction = this.registerForAuction.bind(this);
        this.buyerCardFeatures = this.buyerCardFeatures.bind(this);
    }

    registerForAuction(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.props.token}`;

        axios.post('/bid', {
            id: this.props.propertyId,
            offerPrice: "100",
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                // Show notification that this worked
            }
        }).catch((error) => {
            console.log(error);
        });
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
                    propertyDetails : response.data
                });
                this.props.givePropertyDetails(this.state.propertyDetails);
                this.props.checkRedirect(true);
              }
          }).catch((error) =>{
              console.log(error);
          });
    }
    
    toggleFavorites(){
        if(this.state.addedToFav === false){
            //perform api call to add to favs
            this.setState({
                starImage: fullStar,
                addedToFav: true
            });
        }
        else{
            //perform api call to remove from favs
            this.setState({
                starImage: emptyStar,
                addedToFav: false
            });
        }
    }

    hoverFavorites(){
        if(this.state.addedToFav === false){
            this.setState({starImage:emptyStar});
        }
    }

    buyerCardFeatures(){
        if (this.props.userType === 'buyer'){
            return(
            <Col>
                <Row className="justify-content-md-center" style={{marginTop:"15%"}}>
                    <img className ="favorites" alt="Add to Fav" src={this.state.starImage} onClick ={() => {this.toggleFavorites()}} onMouseOver ={() =>{this.setState({starImage:halfStar})}} onMouseLeave={() =>{this.hoverFavorites()} } />
                </Row>
                <Row className="justify-content-md-center" style={{marginTop:"5%"}}>
                    <Button style={{background : "#05445E", borderColor: "#05445E"}} onClick={() => {this.registerForAuction()}}>Register!</Button>
                </Row>
            </Col>
        )}

    }

    render(){
        return(
            <Container>
                <Card fluid style={{height:"260px", padding:"5px"}}>
                    <Row>
                        <Col md="auto" onClick ={() => this.redirectToProperty()}>
                            <Card.Img  variant = "left" src={this.props.image} alt="House Image" style={{height:"250px", width:"300px"}}/>
                        </Col>
                        <Col md="auto" onClick ={() => this.redirectToProperty()}>
                            <Card.Title>
                                {this.props.streetAddress}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{this.props.propertyType}</Card.Subtitle>
                            <Card.Body>
                                    Beds: {this.props.beds}
                                    <br/>
                                    Baths: {this.props.baths}
                                    <br/>
                                    Car Spots: {this.props.carSpots}
                                    <br/>
                                    Auction Start: {(new Date(parseInt(this.props.auctionStart)).toString()).slice(0,24)}
                            </Card.Body>
                        </Col>
                        {this.buyerCardFeatures()}
                    </Row>
                </Card>
            </Container>
        );
    }
}

export default ResultCard;