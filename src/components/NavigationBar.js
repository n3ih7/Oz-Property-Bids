import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';

class NavigationBar extends Component{
    render(){
        return(
            <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Auction House</Navbar.Brand>
              <Nav className="container-fluid" >
                <Nav.Link href="/buy">Buy</Nav.Link>
                <Nav.Link href="/sell">Sell</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link className = "ml-auto" href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">Sign Up!</Nav.Link>
              </Nav>
          </Navbar>
        );
    }
}

export default NavigationBar;