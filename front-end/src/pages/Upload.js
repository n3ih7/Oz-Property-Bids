import React, {Component} from 'react';
import {Container, Card, Form, Col, Row, Button, Spinner} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Redirect} from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import './Upload.css';
const axios = require('axios');

class Upload extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            redirect : false,
            images : [],
            mappedImages : [],
            maxImageNumber : 15,
            loading : false,
            date1 :  new Date(),
            auctionDuration : 0,
            dateTimeEnd: null,
            acceptCard: false,
            acceptBank: false,
            acceptCheque: false
        }

        this.beds = React.createRef();
        this.baths = React.createRef();
        this.carSpots = React.createRef();
        this.address1 = React.createRef();
        this.address2 = React.createRef();
        this.territory = React.createRef();
        this.postCode = React.createRef();
        this.reserve = React.createRef();
        this.city = React.createRef();
        this.description = React.createRef();
        this.title = React.createRef();
        this.propertyType = React.createRef();
        this.area = React.createRef();
    
        this.cookies = this.props.cookies;
        this.pageContent = this.pageContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
    }

    onImageChange(imageList, addUpdateIndex){
         this.setState({images: imageList});
         this.setState({mappedImages : this.state.images.map((image) =>{return image.data_url})});
    }

    pageContent(){
        if (this.state.redirect === true){
            return(
                <Redirect to="/sell"/>
            )
        }
        else if (this.state.loading === true){
            
            return(
                <Row className="justify-content-md-center">
                <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
                </Row>
            );
        }
        else{
            return(
                <>
                <Card style={{padding:'10px'}}>
                    <Card.Title style ={{marginLeft:"15px"}}>
                        <h1>New Listing</h1>
                    </Card.Title>
                <Card.Body>
                    <Form>
                        <h4>Location</h4>
                        <Form.Group controlId="formGridAddress1">
                            <Form.Label>Address</Form.Label>
                            <Form.Control placeholder="1234 Main St" ref={this.address1} />
                        </Form.Group>

                        <Form.Group controlId="formGridAddress2">
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control placeholder="Apartment, studio, or floor" ref={this.address2} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control ref={this.city} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>State/Territory</Form.Label>
                            <Form.Control as="select" defaultValue="Choose..." ref={this.territory}>
                                <option>Choose...</option>
                                <option>NSW</option>
                                <option>VIC</option>
                                <option>QLD</option>
                                <option>ACT</option>
                                <option>TAS</option>
                                <option>SA</option>
                                <option>WA</option>
                                <option>NT</option>
                            </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>PostCode</Form.Label>
                            <Form.Control ref={this.postCode} />
                            </Form.Group>
                        </Form.Row>
                        <br/>
                        <h4>Property Details</h4>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridDescription">
                                <Form.Label>Property Title</Form.Label>
                                <Form.Control placeholder="A quick snappy title (5-10 words)" ref={this.title} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control placeholder="Describe your property in detail..." ref={this.description} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridBeds">
                                <Form.Label>Number of Bedrooms</Form.Label>
                                <Form.Control placeholder="" ref={this.beds} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridBaths" >
                                <Form.Label>Number of Bathrooms</Form.Label>
                                <Form.Control type="" placeholder="" ref={this.baths}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridBaths" >
                                <Form.Label>Number of Car Spots</Form.Label>
                                <Form.Control type="" placeholder="" ref={this.carSpots}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridLandsize">
                                <Form.Label>Property Size (Square Meters)</Form.Label>
                                <Form.Control placeholder="" ref={this.area} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPropertyType">
                            <Form.Label>Please choose what best describes your property</Form.Label>
                            <Form.Control as="select" defaultValue="Choose..." ref={this.propertyType}>
                                <option>Choose...</option>
                                <option>Apartment</option>
                                <option>Unit</option>
                                <option>House</option>
                            </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <h4>Images</h4>
                        <Row style={{marginLeft:"0.05%"}}> 
                        <ImageUploading
                                multiple
                                value={this.state.images}
                                onChange={this.onImageChange}
                                maxNumber={this.state.maxImageNumber}
                                dataURLKey="data_url"
                            >
                                {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                isDragging,
                                dragProps
                                }) => (
                                <div className="upload__image-wrapper">
                                    <Button 
                                    style={isDragging ? { background : "#05445E" ,color: "yellow" } : {background : "#05445E", border: "#05445E"}}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                    >
                                    Click or Drop Here
                                    </Button>
                                    &nbsp;
                                    <Button style={{background : "#05445E", border: "#05445E"}} onClick={onImageRemoveAll}>Remove all Images</Button>
                                    <Row style={{margin:"0.05%", marginTop:"1%"}}>
                                        {imageList.map((image, index) => (
                                        <div key={index} className="image-item" >
                                            <img src={image.data_url} alt="" width="150px" height="100px" />
                                            <br/>
                                            <div className="image-item__btn-wrapper" style={{"textAlign": "center"}}>
                                                <Button size="sm" style={{background : "#05445E", border: "#05445E"}} onClick={() => onImageRemove(index)}>Remove</Button>
                                            </div>
                                        </div>
                                        ))}
                                    </Row>
                                </div>
                                )}
                            </ImageUploading>
                        </Row>
                        <br/>
                        <h4>Auction Details</h4>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridReservePrice">
                                <Form.Label>Reserve Price</Form.Label>
                                <Form.Control placeholder="Minimum $ bid you are willing to accept" ref={this.reserve} />
                                <Form.Text>This information will not be shared with anyone</Form.Text>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Col controlId="formGridAuctionStartSeller">
                                <Form.Label>Auction Start Time</Form.Label>
                                <br/>
                                <DatePicker className = "calendar" showTimeSelect dateFormat="Pp" selected = {this.state.date1} onChange={date => {this.setState({date1 : date})}}/>
                            </Col>
                            <Form.Group as={Col} controlId="formGridDuration">
                                <Form.Label>Desired Auction Duration (days)</Form.Label>
                                <input className="calendar" value={this.state.auctionDuration} onChange={(e) =>{
                                    if(e.target.value){
                                    this.setState({auctionDuration: e.target.value, dateTimeEnd: new Date((new Date()).setTime((new Date()).getTime() + parseInt(e.target.value) * 86400000))});
                                    }
                                    else {
                                        this.setState({auctionDuration: e.target.value});
                                    }}}></input>
                                <br/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridAuctionEndSeller">
                                <Form.Label>Auction End Time</Form.Label>
                                <br/>
                                <DatePicker className="calendar" showTimeSelect dateFormat="Pp" selected={this.state.dateTimeEnd} onChange={date => {this.setState({dateTimeEnd : date, auctionDuration:(Math.round((-1*this.state.date1.getTime() + date.getTime())/(1000*60*60*24)))})}}/>
                            </Form.Group>
                        </Form.Row>
                        <br/>
                        <h4>Accepted Payment Methods</h4>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridPaymentMethods">
                                <Form.Row>
                                    <Form.Check style={{marginRight:"15px", marginLeft:"5px"}} type="checkbox" id="default-radio1" label="Credit Card" onClick={() => {this.setState({acceptCard: !this.state.acceptCard})}}></Form.Check>
                                    <Form.Check style={{marginRight:"15px"}} type="checkbox" id="default-radio2" label="Bank Transfer" onClick={() => {this.setState({acceptBank: !this.state.acceptBank})}}></Form.Check>
                                    <Form.Check style={{marginRight:"5px"}} type="checkbox" id="default-radio3" label="Cheque" onClick={() => {this.setState({acceptCheque: !this.state.acceptCheque})}}></Form.Check>
                                </Form.Row>
                                <Form.Text>Payment methods you are willing to accept for your property</Form.Text>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    <br/>
                    <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {(e) => {this.handleSubmit(e)}}>
                        Submit
                    </Button>
                </Card.Body>
                </Card>
                </>
            );
        } 
    }
    
    handleSubmit(e){
        e.preventDefault();
        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;
  
        axios.post('/property', {
            propertyType: this.propertyType.current.value,
            unitNumber: this.address2.current.value,
            streetAddress: this.address1.current.value,
            city: this.city.current.value,
            state: this.territory.current.value,
            postcode: this.postCode.current.value,
            beds: this.beds.current.value,
            baths: this.baths.current.value,
            parkingSpace: this.carSpots.current.value,
            landSize: this.area.current.value,
            reservePrice: this.reserve.current.value,
            auction_start: `${(this.state.date1.getTime())}`,
            auction_duration : `${(86400 * this.state.auctionDuration)}`,
            intro_title: this.title.current.value,
            intro_text: this.description.current.value,
            images : this.state.mappedImages
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200){
                this.setState({redirect :true});
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        return(
            <Container style= {{marginTop:"2%"}}>
                {this.pageContent()}
            </Container>
        );
    }
}

export default Upload;