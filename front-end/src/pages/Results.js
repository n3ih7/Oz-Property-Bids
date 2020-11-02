import React, {Component} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import ResultCard from '../components/ResultCard';
import AutoResults from '../components/AutoResults';
import DatePicker from "react-datepicker";
import house1 from "./test-data/house_1.jpg";
import house2 from "./test-data/house_2.jpg";
const axios = require('axios');

class Results extends Component{
    constructor(props){
        super(props);

        this.state = {
            // results : false,
            results : true,
            // Delete properties when in prod
            properties: [{streetAddress : "123 Apple Street", postcode : "2012", image : house1, introTitle:"A wonderful home in the town of Watonnga, this house is home to Mike and Linda who have lived here for 900 years. Now they wish to sell their home as they are migrating to Europe."}, {streetAddress : "44 Era Street", postcode : "2209",introTitle:"A wonderful home in the town of Watonnga, this house is home to Mike and Linda who have lived here for 900 years. Now they wish to sell their home as they are migrating to Europe." ,image : house2}],
            autofillResults : null,
            date1: (this.props.firstSearchParams != null) ? this.props.firstSearchParams.initialAuctionStart :new Date(),
            date2: (this.props.firstSearchParams != null) ? this.props.firstSearchParams.initialAuctionEnd :new Date((new Date()).setTime((new Date()).getTime() + 7 * 86400000)),
            searchValue: (this.props.firstSearchParams != null) ? this.props.firstSearchParams.initialLocation : null,
            timer : null
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

    }

    handleChange(){
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(() => {
        this.autoFill();
      }, 1000);
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
                <Col md="auto">
                    <Row>
                    <h6 className="auction-label-one" style={{color:"white"}}>Auction Date Range:</h6>
                    <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date1} onChange={date => {this.setState({date1 : date}); console.log(this.state.date1);}}/>
                    </Row>
                </Col>
                <Col md="auto">
                    <Row>
                    <h6 className="auction-label-two" style={{color:"white"}}>-</h6>
                    <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date2} onChange={date => this.setState({date2 : date})}/>
                    </Row>
                </Col>
                </Row>
            </Container>
        )
    }

    handleSubmit(){
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
    
        axios.get('/buy', {params:{
          keyword: this.location.current.value.slice(this.location.current.value.length - 4),
          beds : (this.numberBeds.current.value != null) ? this.numberBeds.current.value : "Any",
          baths : (this.numberBaths.current.value != null) ? this.numberBaths.current.value : "Any",
          carspots: (this.numberCarSpots.current.value != null) ? this.numberCarSpots.current.value : "Any",
          auction_start: `${this.state.date1.getFullYear()}-${('0'+(this.state.date1.getMonth()+1)).slice(-2)}-${this.state.date1.getDate()}`,
          auction_end: `${this.state.date2.getFullYear()}-${('0'+(this.state.date2.getMonth()+1)).slice(-2)}-${this.state.date2.getDate()}`
        }})
        .then((response) => {
            if (response.status === 200){
              this.setState({
                  results : true,
                  properties : response.data.result
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

    pageContent(){
        if(this.state.results){
            return(
                this.state.properties.map(property =>(
                  <>
                    <Row>
                        <ResultCard streetAddress={property.streetAddress} postcode={property.postcode} introTitle = {property.introTitle} image={property.image /*? property.image.substring(property.image.length) : ' '*/}/>
                    </Row>
                    <br/>
                    </>
                ))
            );
        }

        if(this.props.results.result){
            if(this.props.results.result.length > 0){
                this.setState({
                    properties: this.props.results.result,
                    results : true
                })
            }
        }
    }

    render(){
        return(
            <>
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