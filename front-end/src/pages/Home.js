import React, {Component} from 'react';
import {Container, Jumbotron, Form, Col, Row, Button} from 'react-bootstrap';
import './Home.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Home extends Component{

  constructor(props) {
    super(props);

    this.state = {
      date :  new Date()
    }

    this.cookies = this.props.cookies;
    this.numberBeds = React.createRef();
  }


    render(){
      return(
          <Jumbotron fluid className ="jumbo">
            <div className ="overlay">
            </div>
            <Container className ="overlay-content">
                <Row><Col><h1>Welcome to Aussie Bids</h1></Col></Row>
                <Row><Col><h4>Helping you with your Home</h4></Col></Row>
                <br/>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Row>
                        <Col>
                          <Form.Control size="lg" type="text" placeholder="Search by Suburb or Postcode" />
                        </Col>
                        <Button column="lg" className="searchButton" lg={2} style={{background : "#05445E", border: "#05445E"}}>
                          Search
                        </Button>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                </Row>

              <Row className="justify-content-md-center">
                <Col md="auto">
                    <Form.Control as="select" placeholder="Beds" size ="sm">
                      <option value="null">Beds</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </Form.Control>
                </Col>
                <Col md="auto">
                    <Form.Control as="select" placeholder="Bathrooms" size ="sm">
                      <option value="null">Bathrooms</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </Form.Control>
                </Col>
                <Col md="auto">
                    <Form.Control as="select" placeholder="Garage" size ="sm">
                      <option value="null">Car Spots</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </Form.Control>
                </Col>
                <Col md="auto">
                  <DatePicker selected = {this.state.date} />
                </Col>  
              </Row>
            </Container>
          </Jumbotron>
      );
    }
}

export default Home;