import React, {Component} from 'react';
import {Card, Container, Col, Row} from 'react-bootstrap';
import emptyStar from "../assets/empty_star.png";
import halfStar from "../assets/hover_star.png";
import fullStar from "../assets/full_star.png";
import './ResultCard.css';

class ResultCard extends Component{

    constructor(props){
        super(props);
        this.state = {
            starImage : emptyStar,
            addedToFav: false
        }

        this.toggleFavorites = this.toggleFavorites.bind(this);
        this.hoverFavorites = this.hoverFavorites.bind(this);
    }

    redirectToHouse(){
        
    }
    
    toggleFavorites(){
        if(this.state.addedToFav === false){
            //perform api call to add to favs
            this.setState({
                starImage: fullStar,
                addedToFav: true
            });
        }
        else{
            //perform api call to remove from favs
            this.setState({
                starImage: emptyStar,
                addedToFav: false
            });
        }
    }

    hoverFavorites(){
        if(this.state.addedToFav === false){
            this.setState({starImage:emptyStar});
        }
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
                                <img className ="favorites" alt="Add to Fav" src={this.state.starImage} onClick ={() => {this.toggleFavorites()}} onMouseOver ={() =>{this.setState({starImage:halfStar})}} onMouseLeave={() =>{this.hoverFavorites()} } />
                            </Container>
                        </Col>
                    </Row>
                </Card>
            </Container>
        );
    }
}

export default ResultCard;