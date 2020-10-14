import React, {Component} from 'react';
import {Container, Jumbotron, Form, Col, Row, Button} from 'react-bootstrap';
import './Home.css';
import DatePicker from "react-datepicker";
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class Home extends Component{

  constructor(props) {
    super(props);

    this.state = {
      date :  new Date(),
      results : false
    }

    this.cookies = this.props.cookies;
    this.numberBeds = React.createRef();
    this.numberBaths = React.createRef();
    this.numberCarSpots = React.createRef();
    this.maxPrice = React.createRef();
    this.minPrice = React.createRef();
    this.location = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.pageContent = this.pageContent.bind(this);
  }

  pageContent(){
    if(this.state.results){
      return(
        <Redirect to="/results"/>
      );
    }
    else{
      return(
        <Jumbotron fluid className ="jumbo">
          <div className ="overlay">
          </div>
          <Container className ="overlay-content">
              <Row><Col><h1>Welcome to Oz Property Bids</h1></Col></Row>
              <Row><Col><h4>Helping you with your home</h4></Col></Row>
              <br/>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Row>
                      <Col>
                        <Form.Control size="lg" type="text" placeholder="Search by Suburb or Postcode" ref ={this.location} />
                      </Col>
                      <Button column="lg" className="searchButton" lg={2} style={{background : "#05445E", border: "#05445E"}} onClick = {this.handleSubmit}>
                        Search
                      </Button>
                    </Form.Row>
                  </Form.Group>
                </Col>
              </Row>

            <Row className="">
              <Col md="auto">
                  <Form.Control as="select" placeholder="Beds" size ="sm" ref ={this.numberBeds}>
                    <option value="null">Beds</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </Form.Control>
              </Col>
              <Col md="auto">
                  <Form.Control as="select" placeholder="Bathrooms" size ="sm" ref ={this.numberBaths}>
                    <option value="null">Bathrooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </Form.Control>
              </Col>
              <Col md="auto">
                  <Form.Control as="select" placeholder="Garage" size ="sm" ref ={this.numberCarSpots}>
                    <option value="null">Car Spots</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </Form.Control>
              </Col>
              <Col md="auto">
                <DatePicker className = "calendar" selected = {this.state.date} onChange={date => this.setState({date : date})}/>
              </Col>
              <Col md="auto">
                  <Form.Control as="input" placeholder="Max Price $" size ="sm" ref ={this.maxPrice}>
                  </Form.Control>
              </Col>
              <Col md="auto">
                  <Form.Control as="input" placeholder="Min Price $" size ="sm" ref ={this.minPrice}>
                  </Form.Control>
              </Col>   
            </Row>
          </Container>
        </Jumbotron>
      )
    }
  }

  handleSubmit(){
    axios.defaults.baseURL = 'http://api.nono.fi:5000';

    axios.get('/buy', {params:{
      keyword: this.location.current.value,
      // bedrooms : this.numberBeds.current.value,
      // bathrooms : this.numberBaths.current.value,
      // minprice: this.minPrice.current.value,
      // maxprice: this.maxPrice.current.value
    }})
    .then((response) => {
        // console.log(response);
        
        if (response.status === 200){
          this.props.dataCallback(response.data);
          this.setState({results: true});
        }
    }).catch((error) =>{
        console.log(error);
    });
  }

  render(){
    return(
      <>
        {this.pageContent()}
      </>
    );
  }
}

export default Home;