import React, {Component} from 'react';
import {Container, Jumbotron, Form, Col, Row, Button} from 'react-bootstrap';
import './Home.css';
import DatePicker from "react-datepicker";
import {Redirect} from 'react-router-dom';
import AutoResults from '../components/AutoResults';
import ResultCard from '../components/ResultCard';
const axios = require('axios');

class Home extends Component{

  constructor(props) {
    super(props);

    this.state = {
      date1 :  new Date(),
      date2: new Date((new Date()).setTime((new Date()).getTime() + 7 * 86400000)),
      results : false,
      autofillResults : null,
      dateRange : true,
      gotSuggested : false,
      suggestedProperties : []    
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
    this.handleChange = this.handleChange.bind(this);
    this.handleDateToggle = this.handleDateToggle.bind(this);
    this.getSuggested = this.getSuggested.bind(this);
    this.checkRedirect = this.checkRedirect.bind(this);

  }

  checkRedirect(redirectNow){
    this.setState({redirect: redirectNow});
  }

  getSuggested(){
    if(!this.state.gotSuggested){
      
      if(this.cookies.get('cid') && (this.cookies.get('userType') !== 'seller')){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['CID'] = `Token ${this.cookies.get('cid')}`;

        if(this.cookies.get('token')){
          axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;
        }

        axios.get('/recommendation')
        .then((response) => {
            console.log(response);
            this.setState({
              suggestedProperties: response.data.resp.slice(0,1),
              gotSuggested : true
            });

        }).catch((error) =>{
            console.log(error);
        });
      }
      this.setState({gotSuggested:true});
    }
  }

  handleDateToggle(){
    if(this.state.dateRange){
      this.setState({
        dateRange : false,
        date1 : null,
        date2 : null
      });
    }

    else if(!this.state.dateRange){
      this.setState({
        dateRange : true,
        date1 : new Date(),
        date2 : new Date((new Date()).setTime((new Date()).getTime() + 7 * 86400000))
      });
    }
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
    delete axios.defaults.headers.common['CID']

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
        console.log(response);

        if (response.status === 200){
          this.setState({
            autofillResults : response.data.slice(0,3)
          });
        }
      }).catch((error) =>{
          console.log(error);
      });
    }
  }

  handleChange(){
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(() => {
        this.autoFill();
        }, 1000)
      });
  }

  handleSubmit(){
    axios.defaults.baseURL = 'http://api.nono.fi:5000';

    if(this.cookies.get('token')){
      axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;
    }

    if(this.cookies.get('cid')){
      axios.defaults.headers.common['CID'] = `Token ${this.cookies.get('cid')}`;
    }

    axios.get('/search', {params:{
      keyword: this.location.current.value.slice(this.location.current.value.length - 4),
      beds : (this.numberBeds.current.value != null) ? this.numberBeds.current.value : "Any",
      baths : (this.numberBaths.current.value != null) ? this.numberBaths.current.value : "Any",
      carspots: (this.numberCarSpots.current.value != null) ? this.numberCarSpots.current.value : "Any",
      auction_start: (this.state.dateRange === true) ? `${(this.state.date1.getTime())}` : "",
      auction_end: (this.state.dateRange === true) ? `${(this.state.date2.getTime())}` : ""
      
    }})
    .then((response) => {
      console.log(response);
        if (response.status === 200){
          this.props.dataCallback(response.data);
          this.props.paramsCallback({
            initialLocation: this.location.current.value,
            initialBeds : (this.numberBeds.current.value != null) ? this.numberBeds.current.value : "Any",
            initialBaths : (this.numberBaths.current.value != null) ? this.numberBaths.current.value : "Any",
            initialCarSpots: (this.numberCarSpots.current.value != null) ? this.numberCarSpots.current.value : "Any",
            initialAuctionStart:  (this.state.dateRange === true) ? this.state.date1 : null,
            initialAuctionEnd: (this.state.dateRange === true) ? this.state.date2 : null,
            registeredAuctions : this.state.registeredAuctions,
            suggested : false
          });
          this.cookies.set('cid', response.data.cid,{path:'/'});
          this.setState({results: true});
        }

        
    }).catch((error) =>{

      if (error.response.status !== undefined){
        if(error.response.status === 404){
          
          axios.defaults.baseURL = 'http://api.nono.fi:5000';

          if(this.cookies.get('token')){
            axios.defaults.headers.common['CID'] = `Token ${this.cookies.get('cid')}`;
          }
          if(this.cookies.get('token')){
            axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;
          }
  
          axios.get('/recommendation')
          .then((response) => {
              this.props.dataCallback(response.data);
              this.props.paramsCallback({
                initialLocation: this.location.current.value,
                initialBeds : (this.numberBeds.current.value != null) ? this.numberBeds.current.value : "Any",
                initialBaths : (this.numberBaths.current.value != null) ? this.numberBaths.current.value : "Any",
                initialCarSpots: (this.numberCarSpots.current.value != null) ? this.numberCarSpots.current.value : "Any",
                initialAuctionStart:  (this.state.dateRange === true) ? this.state.date1 : null,
                initialAuctionEnd: (this.state.dateRange === true) ? this.state.date2 : null,
                registeredAuctions : this.state.registeredAuctions,
                suggested : true
              });
              this.cookies.set('cid', response.data.cid,{path:'/'});
              this.setState({results: true});
  
          }).catch((error) =>{
              console.log(error);
          });
        }
      }
    });
  }

  pageContent(){
    if(this.state.redirect){
      return(
        <Redirect to="/house"/>
      );
    }
    else if(this.state.results){
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
                        <Form.Control size="lg" type="text" placeholder="Search by Suburb or Postcode" ref ={this.location} value = {this.state.searchValue } onChange = {() => {this.handleChange()}} onKeyDown = {this.handleKeyPress} />
                      </Col>
                      <Button column="lg" className="searchButton" lg={2} style={{background : "#05445E", border: "#05445E"}} onClick = {() => {this.handleSubmit()}}>
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

              <Row style={{paddingLeft:"5px"}}>
                <h6 className="auction-label-one" style={{paddingLeft:"5px"}}>Auction Date Range:</h6>
                <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date1} onChange={date => this.setState({date1 : date})}/>
              </Row>
            
              <Row style={{paddingLeft:"30px"}}>
                <h6 className="auction-label-two" style={{paddingLeft:"5px"}}>-</h6>
                <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date2} onChange={date => this.setState({date2 : date})}/>
              </Row>

              <Col md="auto" style={{paddingTop:"9px"}}>
                    <Form.Group as ={Col}>
                      <Form.Check type="checkbox" id="default-radio" label="Search All Dates" onClick={() => {this.handleDateToggle()}}></Form.Check>
                    </Form.Group>
              </Col>
            </Row>
            <Row className = "justify-content-md-center" style={{marginTop:"150px"}}>
              {this.getSuggested()}
              {this.state.suggestedProperties.map((property, index) =>(
                    <Col md = "auto" key={index}>
                      <h6 style={{textAlign :"center"}}>Based on your search histroy, this property might be relevant for you</h6>
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
                        registeredAuctions = {[]}
                        acceptedPaymentMethods = {property.accepted_payment_method}
                        introTitle = {property.intro_title}
                        front = {true}
                      />
                    </Col>
                 
              ))}
            </Row>
          </Container>
        </Jumbotron>
      )
    }
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