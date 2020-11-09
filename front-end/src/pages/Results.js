import React, {Component} from 'react';
import {Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import ResultCard from '../components/ResultCard';
import AutoResults from '../components/AutoResults';
import DatePicker from "react-datepicker";
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class Results extends Component{
    constructor(props){
        super(props);

        this.state = {
          loading: true,
          results : false,
          autofillResults : null,
          date1: (this.props.firstSearchParams != null) ? this.props.firstSearchParams.initialAuctionStart :new Date(),
          date2: (this.props.firstSearchParams != null) ? this.props.firstSearchParams.initialAuctionEnd :new Date((new Date()).setTime((new Date()).getTime() + 7 * 86400000)),
          searchValue: (this.props.firstSearchParams != null) ? this.props.firstSearchParams.initialLocation : null,
          redirect : false,
          chosenProperty : null,
          dateRange : true,
          registeredAuctions: [],
          checkedRegisteredAuctions: false   
        }

        this.cookies = this.props.cookies;

        this.numberBeds = React.createRef();
        this.numberBaths = React.createRef();
        this.numberCarSpots = React.createRef();
        this.location = React.createRef();

        this.pageContent = this.pageContent.bind(this);
        this.searchBar = this.searchBar.bind(this);
        this.autoFill = this.autoFill.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkRedirect = this.checkRedirect.bind(this);
        this.handleDateToggle = this.handleDateToggle.bind(this);
        this.getRegisteredAuctions = this.getRegisteredAuctions.bind(this);
    }

    getRegisteredAuctions(){
      if((this.cookies.get('userType') === 'bidder')&&(!this.state.checkedRegisteredAuctions)){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;
  
        axios.get('/get_rab_status').then((response) => {
          console.log(response);

          if (response.status === 200){
            this.setState({
                registeredAuctions : response.data.rab_registered,
                checkedRegisteredAuctions : true,
                loading: false
            });
          }
          else{
            this.setState({
              checkedRegisteredAuctions : true,
              loading: false
          });
          }
        }).catch((error) =>{
            console.log(error);
        });
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
          date2 :  new Date((new Date()).setTime((new Date()).getTime() + 7 * 86400000))
        });
      }
    }

    checkRedirect(redirectNow){
      this.setState({redirect: redirectNow});
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
  
      axios.get('/search', {params:{
        keyword: this.location.current.value.slice(this.location.current.value.length - 4),
        beds : (this.numberBeds.current.value != null) ? this.numberBeds.current.value : "Any",
        baths : (this.numberBaths.current.value != null) ? this.numberBaths.current.value : "Any",
        carspots: (this.numberCarSpots.current.value != null) ? this.numberCarSpots.current.value : "Any",
        auction_start: (this.state.dateRange === true) ? `${(this.state.date1.getTime())}` : "",
        auction_end: (this.state.dateRange === true) ? `${(this.state.date2.getTime())}` : ""
      }})
      .then((response) => {
          if (response.status === 200){
            console.log(response);
            this.setState({
                results : true,
                properties : response.data.resp
            })
          }
      }).catch((error) =>{
          console.log(error);
      });
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
            autofillResults : response.data.slice(0,3)
          });
        }
      }).catch((error) =>{
          console.log(error);
      });
    }
  }

  searchBar(){
      return(
          <Container fluid style={{marginTop: "1%"}}>
              <Row>
              <Col>
                  <Form.Group>
                  <Form.Row>
                      <Col>
                      <Form.Control size="lg" type="text" placeholder="Search by Suburb or Postcode" ref ={this.location} value = {this.state.searchValue } onChange = {this.handleChange} onKeyDown = {this.handleKeyPress} />
                      </Col>
                      <Button column="lg" className="searchButton" lg={2} style={{background : "#05445E", borderColor: "white"}} onClick = {this.handleSubmit}>
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
                <h6 className="auction-label-one" style={{paddingLeft:"5px", color:"white"}}>Auction Date Range:</h6>
                <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date1} onChange={date => this.setState({date1 : date})}/>
                </Row>
              
                <Row style={{paddingLeft:"30px"}}>
                  <h6 className="auction-label-two" style={{paddingLeft:"5px", color:"white"}}>-</h6>
                  <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date2} onChange={date => this.setState({date2 : date})}/>
                </Row>

                <Col md="auto" style={{paddingTop:"9px"}}>
                    <Form.Group as ={Col}>
                    <Form.Check style={{color:"white"}} type="checkbox" id="default-radio" label="Search All Dates" onClick={() => {this.handleDateToggle()}}></Form.Check>
                    </Form.Group>
                </Col>
              </Row>
          </Container>
      )
  }

  pageContent(){
    if(this.state.redirect === true){
      return(
        <Redirect to="/house"/>
      );
    }

    else if(this.state.loading){
      return(
        <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
      );
    }

    else if(this.state.results){
          return(
              this.state.properties.map(property =>(
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
                        registeredAuctions = {this.state.registeredAuctions}
                      />
                  </Row>
                  <br/>
                  </>
              ))
          );
      }

      else if(this.props.results.resp){
          if(this.props.results.resp.length > 0){
              this.setState({
                  properties: this.props.results.resp,
                  results : true
              })
          }
      }
  }

  render(){
      return(
          <>  
              {this.getRegisteredAuctions()}
              {this.searchBar()}
              <Container fluid style={{marginTop: "1%"}}>
                  <Col>
                  {this.pageContent()}
                  </Col>
              </Container>
          </>
      );
  }
}

export default Results;