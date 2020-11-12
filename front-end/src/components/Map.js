import React, { Component } from 'react';
import {Col, Row, ListGroup} from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import hospital from '../assets/hospital.png';
import police from '../assets/police.png';
import school from '../assets/school.png';
import supermarket from '../assets/supermarket.png';
import university from '../assets/university.png';
import walking from '../assets/walking.png';
import driving from '../assets/drive.png';
import marker from '../assets/marker.png';
const axios = require('axios');

const MapMarker = ({ text }) => 
  <Col>
    <Row style={{backgroundImage:{marker}}}>{text}</Row>
  </Col>;

class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      houseCenter : {
        lat :59.95,
        lng :30.33,
      },
      mapZoom: 15,
      services : [],
      serviceNames : ["Hospitals", "Police Stations","Schools","Supermarkets","Universities"],
      serviceImages : [hospital, police, school, supermarket, university],
      haveMapDetails : false
    }

    this.getMapDetails = this.getMapDetails.bind(this);
  }
  
  getMapDetails(){
    if(!this.state.haveMapDetails){

        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.get('/mapinfo', {params:{
            id: this.props.propertyId,
        }})
        .then((response) => {
            if (response.status === 200){
                console.log(response.data);
                
                this.setState({
                  haveMapDetails : true,
                  houseCenter : response.data.property_location,
                  services : [
                    (response.data.hospital.location !== undefined) ? response.data.hospital : null,
                    (response.data.police.location !== undefined) ? response.data.police : null,
                    (response.data.school.location !== undefined) ? response.data.school : null,
                    (response.data.supermarket.location !== undefined) ? response.data.supermarket : null,
                    (response.data.university.location !== undefined) ? response.data.university : null
                  ]
                });
            }
        }).catch((error) =>{
            console.log(error);
        });
    }
}

  render() {
    if (this.state.haveMapDetails){
      return(
        <Row>
            <Col>
            <div style={{ height: '80vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyBeeHfpZuehFLKU239tacm_j01rmRJlLFk" }}
                defaultCenter={this.state.houseCenter}
                defaultZoom={this.state.mapZoom}
              >
                <MapMarker
                  lat={this.state.houseCenter.lat}
                  lng={this.state.houseCenter.lng}
                  text= {this.props.propertyAddress}
                />

                {this.state.services.flatMap((service, index) =>(
                  (service !== null) ?
                  <MapMarker
                    lat={service.location.lat}
                    lng={service.location.lng}
                    text= {service.addr}
                  />
                  : []
                ))}
              </GoogleMapReact>
            </div>
          </Col>
          <Col>
          <ListGroup>
          {this.state.services.map((service, index) =>(
            <ListGroup.Item>
              <Row>
                <Col>
                  <Row className="justify-content-md-center">{this.state.serviceNames[index]}</Row>
                  <Row className="justify-content-md-center"><img src ={this.state.serviceImages[index]} style={{height:"50px", width:"50px"}} alt =""/></Row>
                </Col>
                <Col>
                {(service !== null ? service.name : "Look's like there are no "+ (this.state.serviceNames[index]).toLowerCase() + " in the immediate area.")}
                </Col>
                <Col>
                <Row className="justify-content-md-center">
                  <Col>
                    <Row className="justify-content-md-center">{(service !== null ? service.travel_time_by_walking : "")}</Row>
                    <Row className="justify-content-md-center">{(service !== null ? <img src={walking} style={{height:"50px", width:"50px"}} alt ="walking time"/>  : "")}</Row>
                  </Col>
                  <Col>
                    <Row className="justify-content-md-center">{(service !== null ? service.travel_time_by_driving : "")}</Row>
                    <Row className="justify-content-md-center">{(service !== null ? <img src={driving} style={{height:"50px", width:"50px"}} alt ="driving time"/>  : "")}</Row>
                  </Col>
                  </Row>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
          </ListGroup>
          </Col>
        </Row>
      );
    }

  else{
    return (
      <>
      {this.getMapDetails()}
      </>
    );
  }
}
}

export default Map;