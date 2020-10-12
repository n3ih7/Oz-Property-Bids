import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class LogOut extends Component{
    constructor(props){
        super(props);

        this.state ={
            loading : true
        }

        this.cookies = this.props.cookies;
        this.cookies.set('authenticated',false);

        this.pageContent = this.pageContent.bind(this);
        this.logOutBuffer = this.logOutBuffer.bind(this);
    };

    pageContent(){
        if (this.state.loading === true){
            return(
                <Row className="justify-content-md-center">
                    <Spinner animation="border" role="status" style={{marginTop:"20%"}}></Spinner>
                </Row>
            );
        }
        else{
            return(
                <Redirect to="/"/>
            );
        }
    }

    logOutBuffer(){
        if (this.state.loading === true){
            setTimeout(()=>
            {this.setState({loading : false });
            window.location.reload(false);
        }, 2000);
        }
    }

    render(){
        return(
            <Container className = "pageContent">
                {this.pageContent()}
                {this.logOutBuffer()}
            </Container>
            
        );
    }
}

export default LogOut;