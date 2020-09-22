import React, {Component} from 'react';
import {Container, Jumbotron} from 'react-bootstrap';
import './Home.css';

class Home extends Component{
    render(){
      return(
          <>
          <Jumbotron fluid className = "jumbo">
            <div className ="overlay">
                <Container>
                    <h1>Welcome to Auction House</h1>
                    <h4>Helping you with your home</h4>
                </Container>
            </div>
          </Jumbotron>
          </>
      );
    }
}

export default Home;