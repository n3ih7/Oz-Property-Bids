import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import ResultCard from '../components/ResultCard';

class Results extends Component{
    constructor(props){
        super(props);

        this.state = {results : false}

        this.pageContent = this.pageContent.bind(this);
        console.log(this.props.results.result);
    }

    searchBar(){
        
    }


    pageContent(){
        if(this.state.results){
            return(
                this.state.properties.map(property =>(
                    <>
                    <ResultCard streetAddress={property.streetAddress} postcode={property.postcode} introTitle = {property.introTitle} image={property.image ? property.image.substring(2,property.image.length-1) : ' '}/>
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
            <Container style={{marginTop: "5%"}}>
                <Row><h1 style={{color:"white"}}>Results</h1></Row>
                <br/>
                {this.pageContent()}
            </Container>
        );
    }
}

export default Results;