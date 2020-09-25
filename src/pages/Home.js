import React, {Component} from 'react';
import {Container, Jumbotron, Form, Col, Row, Button, Dropdown} from 'react-bootstrap';
import './Home.css';
import bed from '../assets/bed.png'

class Home extends Component{

  CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      className ="dropdown-toggle"
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <img src = {bed} className = "custom-icon"/>
      {children}
    </a>
  ));


    render(){
      return(
          <>
          <Jumbotron fluid className ="jumbo">
            <div className ="overlay">
            </div>
            <Container className ="overlay-content">
                <Row><Col><h1>Welcome to Oz Bids</h1></Col></Row>
                <Row><Col><h4>Helping you with your Home</h4></Col></Row>
                <br/>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Row>
                        <Col>
                          <Form.Control size="lg" type="text" placeholder="Search by Suburb or Postcode" />
                        </Col>
                        <Button column="lg" variant="info" lg={2}>
                          Search
                        </Button>
                      </Form.Row>
                    </Form.Group>
                  </Col>
                </Row>
                    
                <Row>
                  <Container>
                    <Dropdown fluid>
                      <Row className="justify-content-md-center">
                        <Col md="auto">
                          <Dropdown.Toggle as={this.CustomToggle} id="dropdown-bathroom"></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="1">1</Dropdown.Item>
                              <Dropdown.Item eventKey="2">2</Dropdown.Item>
                              <Dropdown.Item eventKey="3">3</Dropdown.Item>
                              <Dropdown.Item eventKey="1">4+</Dropdown.Item>
                            </Dropdown.Menu>
                          </Col>
                      
                          <Col md="auto">
                          <Dropdown.Toggle as={this.CustomToggle} id="dropdown-bathroom"></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="1">1</Dropdown.Item>
                              <Dropdown.Item eventKey="2">2</Dropdown.Item>
                              <Dropdown.Item eventKey="3">3</Dropdown.Item>
                              <Dropdown.Item eventKey="1">4+</Dropdown.Item>
                            </Dropdown.Menu>
                          </Col>
                      
                          <Col md="auto">
                          <Dropdown.Toggle as={this.CustomToggle} id="dropdown-bathroom"></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="1">1</Dropdown.Item>
                              <Dropdown.Item eventKey="2">2</Dropdown.Item>
                              <Dropdown.Item eventKey="3">3</Dropdown.Item>
                              <Dropdown.Item eventKey="1">4+</Dropdown.Item>
                            </Dropdown.Menu>
                          </Col>

                          <Col md="auto">
                          <Dropdown.Toggle as={this.CustomToggle} id="dropdown-bathroom"></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey="1">1</Dropdown.Item>
                              <Dropdown.Item eventKey="2">2</Dropdown.Item>
                              <Dropdown.Item eventKey="3">3</Dropdown.Item>
                              <Dropdown.Item eventKey="1">4+</Dropdown.Item>
                            </Dropdown.Menu>
                          </Col>
                      </Row>
                    </Dropdown>
                    </Container>
                </Row>

            </Container>
          </Jumbotron>
          </>
      );
    }
}

export default Home;