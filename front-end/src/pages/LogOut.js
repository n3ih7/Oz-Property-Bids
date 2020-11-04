import React, {Component} from 'react';
import {Container, Row, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
const axios = require('axios');

class LogOut extends Component{
    constructor(props){
        super(props);

        this.state ={
            loading : true
        }

        this.cookies = this.props.cookies;

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

        axios.defaults.baseURL = 'http://api.nono.fi:5000';
        axios.defaults.headers.common['Authorization'] = `Token ${this.cookies.get('token')}`;

        axios.get('/logout')
        .then((response) => {
            this.setState({loading : false });
            this.cookies.set('authenticated',false);
            this.cookies.remove('userType');
            this.cookies.remove('token');
            this.cookies.remove('expireTime');
            window.location.reload(false);
        }).catch((error) =>{
            this.setState({loading : false });
            this.cookies.set('authenticated',false);
            this.cookies.remove('userType');
            this.cookies.remove('token');
            this.cookies.remove('expireTime');
            window.location.reload(false);
        });
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