import React, {Component} from 'react';
import {Card, Container, Col, Row} from 'react-bootstrap';


class ResultCard extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Container>
                <Card style={{ width: '600px' }}>
                    <Card.Img variant = "top" src={`data:image/png;base64,${this.props.image}`} alt="House Image"/>
                    <Card.Title>
                        {this.props.streetAddress}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.props.postcode}</Card.Subtitle>
                    <Card.Body>
                    <Card.Text>
                        {this.props.introTitle}
                    </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default ResultCard;