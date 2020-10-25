import React, {Component} from 'react';
import {Container, Jumbotron, Form, Col, Row, Button} from 'react-bootstrap';
import './Home.css';
import DatePicker from "react-datepicker";
import {Redirect} from 'react-router-dom';
import AutoResults from '../components/AutoResults';
const axios = require('axios');

class Home extends Component{

  constructor(props) {
    super(props);

    this.state = {
      date1 :  new Date(),
      date2: (new Date()).setTime((new Date()).getTime() + 7 * 86400000),
      results : false,
      autofillResults : null,
    }

    this.cookies = this.props.cookies;
    this.numberBeds = React.createRef();
    this.numberBaths = React.createRef();
    this.numberCarSpots = React.createRef();
    this.location = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.pageContent = this.pageContent.bind(this);
    this.autoFill = this.autoFill.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event){
   let key = event.keyCode || event.charCode;

    if (key === 13){
      this.handleSubmit();
    }
    else if(key === 46 || key === 8){
      this.setState({searchValue: null});
    }
  }
  
  getAutoSelect = (result) => {
    if(result != null){
      this.setState({
        searchValue: result,
        autofillResults: null
      })
    }
  }
  
  autoFill(){
    let userInput = this.location.current.value;
    axios.defaults.baseURL = 'http://api.jsacreative.com.au/';

    if(userInput.length === 0){
      this.setState({
        autofillResults: null
      });
      return;
    }

    if (isNaN(userInput)){

      axios.get('v1/suburbs', {params:{
        q: userInput,
      }})
      .then((response) => {
        // console.log(response.data.slice(0,6));
          
        if (response.status === 200){
          this.setState({
            autofillResults : response.data.slice(0,3)
          });
        }
      }).catch((error) =>{
          console.log(error);
      });
    }

    else {
      axios.get('v1/suburbs', {params:{
        postcode: userInput,
      }})
      .then((response) => {
          
        if (response.status === 200){
          this.setState({
            autofillResults : response.data.slice(0,6)
          });
        }
      }).catch((error) =>{
          console.log(error);
      });
    }
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
                        <Form.Control size="lg" type="text" placeholder="Search by Suburb or Postcode" ref ={this.location} value = {this.state.searchValue } onChange = {this.autoFill} onKeyDown = {this.handleKeyPress} />
                      </Col>
                      <Button column="lg" className="searchButton" lg={2} style={{background : "#05445E", border: "#05445E"}} onClick = {this.handleSubmit}>
                        Search
                      </Button>
                    </Form.Row>
                  </Form.Group>
                  <AutoResults suggestions = {this.state.autofillResults} selectCallback ={this.getAutoSelect.bind(this)}/>
                </Col>
              </Row>

            <Row className="">
              <Col md="auto">
                  <Form.Control as="select" placeholder="Beds" size ="sm" ref ={this.numberBeds}>
                    <option value="null">Beds</option>
                    <option value="Any">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </Form.Control>
              </Col>
              <Col md="auto">
                  <Form.Control as="select" placeholder="Bathrooms" size ="sm" ref ={this.numberBaths}>
                    <option value="null">Bathrooms</option>
                    <option value="Any">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </Form.Control>
              </Col>
              <Col md="auto">
                  <Form.Control as="select" placeholder="Garage" size ="sm" ref ={this.numberCarSpots}>
                    <option value="null">Car Spots</option>
                    <option value="Any">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </Form.Control>
              </Col>
              <Col md="auto">
                <Row>
                <h6 className="auction-label-one">Auction Date Range:</h6>
                <DatePicker className = "calendar" selected = {this.state.date1} onChange={date => this.setState({date1 : date})}/>
                </Row>
              </Col>
              <Col md="auto">
                <Row>
                <h6 className="auction-label-two">-</h6>
                <DatePicker className = "calendar" selected = {this.state.date2} onChange={date => this.setState({date2 : date})}/>
                </Row>
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
      keyword: this.location.current.value.slice(this.location.current.value.length - 4),
      // beds : this.numberBeds.current.value,
      // baths : this.numberBaths.current.value,
      // carspots:
      // auction-start: yyyy-mm-dd,
      // auction-end: yyyy-mm-dd
      
    }})
    .then((response) => {
        if (response.status === 200){

          this.props.dataCallback(response.data);
          this.props.paramsCallback({
            initialLocation: this.location.current.value,
            initialBeds : (this.numberBeds.current.value != null) ? this.numberBeds.current.value : "Any",
            initialBaths : (this.numberBaths.current.value != null) ? this.numberBaths.current.value : "Any",
            initialCarSpots: (this.numberCarSpots.current.value != null) ? this.numberCarSpots.current.value : "Any",
            initialAuctionStart: this.state.date1,
            initialAuctionEnd: this.state.date2
          });
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