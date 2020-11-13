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
import './Map.css';

const HomeMarker = ({ text }) => {
 return <>
  <div className="pinHome"></div>
  <div className="pulse"></div>
  <br/>
  <Row style={{fontSize:"20px"}}>Home</Row>
</>
}

const Marker = ({ text }) => {
  return <>
  
    <div className="pin"></div>
    <div className="pulse"></div>
    <br/>
    <Row style={{fontSize:"20px"}}>{text}</Row>
  </>
}

class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      houseCenter : {
        lat :59.95,
        lng :30.33,
      },
      mapZoom: 14,
      services : [],
      serviceNames : ["Hospital", "Police Station","School","Supermarket","University"],
      serviceImages : [hospital, police, school, supermarket, university],
    }

  }

  render() {
    if (this.props.haveMapDetails){
      return(
        <Row>
            <Col>
            <div style={{ height: '80vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyBeeHfpZuehFLKU239tacm_j01rmRJlLFk" }}
                defaultCenter={this.props.houseCenter}
                defaultZoom={this.state.mapZoom}
              >
                <HomeMarker
                  lat={this.props.houseCenter.lat}
                  lng={this.props.houseCenter.lng}
                  text= {this.props.propertyAddress}
                />

                {this.props.services.flatMap((service, index) =>(
                  (service !== null) ?
                  <Marker
                    lat={service.location.lat}
                    lng={service.location.lng}
                    text= {this.state.serviceNames[index]}
                  />
                  : []
                ))}
              </GoogleMapReact>
            </div>
          </Col>
          <Col>
          <ListGroup>
          {this.props.services.map((service, index) =>(
            <ListGroup.Item>
              <Row>
                <Col>
                  <Row className="justify-content-md-center">{this.state.serviceNames[index]}</Row>
                  <Row className="justify-content-md-center"><img src ={this.state.serviceImages[index]} style={{height:"50px", width:"50px"}} alt =""/></Row>
                </Col>
                <Col>
                {(service !== null ? service.name : "Look's like there is no "+ (this.state.serviceNames[index]).toLowerCase() + " in the immediate area.")}
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
  }
}

export default Map;