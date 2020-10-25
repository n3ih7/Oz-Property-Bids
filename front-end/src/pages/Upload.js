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
            maxImageNumber : 15,
            loading : false,
            date_time_start : new Date(),
            date_time_end: new Date((new Date()).setTime((new Date()).getTime() + 7 * 86400000))
        }

        this.beds = React.createRef();
        this.baths = React.createRef();
        this.carSpots = React.createRef();
        this.address1 = React.createRef();
        this.address2 = React.createRef();
        this.territory = React.createRef();
        this.postCode = React.createRef();
        this.reserve = React.createRef();
    
        this.cookies = this.props.cookies;
        this.pageContent = this.pageContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
    }

    onImageChange(imageList, addUpdateIndex){
        //  console.log(imageList, addUpdateIndex);
         this.setState({images: imageList});
    }

    
    pageContent(){
        if (this.state.redirect === true){
            return(
                <Redirect to="/"/>
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

                            <Form.Group as={Col} controlId="formGridZip" ref={this.postCode}>
                            <Form.Label>PostCode</Form.Label>
                            <Form.Control />
                            </Form.Group>
                        </Form.Row>
                        <br/>
                        <h4>Property Details</h4>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control placeholder="Lovely 5 year old house close by the beach..." ref={this.description} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridBeds">
                                <Form.Label>Number of Bedrooms</Form.Label>
                                <Form.Control placeholder="" ref={this.beds} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridBaths" ref={this.baths}>
                                <Form.Label>Number of Bathrooms</Form.Label>
                                <Form.Control type="" placeholder="" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridBaths" ref={this.carSpots}>
                                <Form.Label>Number of Car Spots</Form.Label>
                                <Form.Control type="" placeholder="" />
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
                                <Form.Control placeholder="Minimum $ bid that must be made to sell" ref={this.reserve} />
                                <Form.Text>This information will not be shared with anyone</Form.Text>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridAuctionStart">
                                <Form.Label>Auction Start Time</Form.Label>
                                <br/>
                                <DatePicker className="calendar" showTimeSelect dateFormat="Pp" selected={this.state.date_time_start} onChange={() =>{this.setState({date_time_start : this.state.date_time_start})}}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridAuctionEnd">
                                <Form.Label>Auction End Time</Form.Label>
                                <br/>
                                <DatePicker className="calendar" showTimeSelect dateFormat="Pp" selected={this.state.date_time_end} onChange={() =>{this.setState({date_time_end : this.state.date_time_end})}}/>
                            </Form.Group>
                        </Form.Row>
                        <Button style={{background : "#05445E", border: "#05445E"}} type="submit" onClick = {() => {this.handleSubmit()}}>
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
                </Card>
                </>
            );
        }
    }
    
    handleSubmit(){

        this.setState({
            
        });

        // axios.defaults.baseURL = 'http://api.nono.fi:5000';

        // axios.post('/signup', {email : this.email.current.value, password: this.password1.current.value})
        // .then((response) => {
        //     console.log(response);
        //     // console.log(response.headers['Set-Cookie']);
        //     // console.log(response.headers['session']);
        //     if (response.status === 200){
        //         this.cookies.set('authenticated',true,{path:'/'});
        //         // this.cookies.set('user',this.email.current.value,{path:'/'});
        //         this.setState({redirect : true});
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // });
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