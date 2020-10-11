import React, {Component} from 'react';
import {Card, Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
// import './SignUp.css';
const axios = require('axios');

class SignUp extends Component{

    constructor(props){
        super(props);
        this.cookies = this.props.cookies;
    }
    
}