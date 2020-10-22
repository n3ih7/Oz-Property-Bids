import React, {Component} from 'react';
import {Card, Container, Col, Row} from 'react-bootstrap';
import emptyStar from "../assets/empty_star.png";
import halfStar from "../assets/hover_star.png";
import './ResultCard.css';

class ResultCard extends Component{

    constructor(props){
        super(props);
        this.state = {
            starImage : emptyStar
        }

        this.addToFavorites = this.addToFavorites.bind(this);
    }

    addToFavorites(){
        //perform api call to add to favs
        //set
    }

    render(){
        return(
            <Container>
                <Card fluid style={{height:"260px", padding:"5px"}}>
                    <Row>
                        <Col md="auto">
                            <Card.Img  variant = "left" src={/*`data:image/png;base64,${*/this.props.image/*}`*/} alt="House Image" style={{height:"250px", width:"300px"}}/>
                        </Col>
                        <Col>
                            <Card.Title>
                                {this.props.streetAddress}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{this.props.postcode}</Card.Subtitle>
                            <Card.Body>
                                <Card.Text>
                                    {this.props.introTitle}
                                </Card.Text>
                            </Card.Body>
                        </Col>
                        <Col md="auto">
                            <Container>
                            <img className ="favorites" src={this.state.starImage} onMouseOver ={() =>{this.setState({starImage:halfStar})}} onMouseLeave={() =>{this.setState({starImage:emptyStar})} } />
                            </Container>
                        </Col>
                    </Row>
                </Card>
            </Container>
        );
    }
}

export default ResultCard;