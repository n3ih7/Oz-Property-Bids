import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';

class NavigationBar extends Component{

  constructor(props){
    super(props);
    this.cookies = this.props.cookies.cookies;

    this.accountPage = this.accountPage.bind(this);
  }
  
  accountPage(){
    if(this.cookies.authenticated === "true"){
      return(
        <Nav.Link className = "ml-auto" href="/account">My Account</Nav.Link>
      );
    }
    else{
      return(
      <>
        <Nav.Link className = "ml-auto" href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Sign Up!</Nav.Link>
      </>
      );
    }

  }

  render(){
      return(
          <Navbar bg="light" variant="light">
          <Navbar.Brand href="/">Aussie Bids</Navbar.Brand>
            <Nav className="container-fluid" >
              <Nav.Link href="/buy">Buy</Nav.Link>
              <Nav.Link href="/sell">Sell</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              {this.accountPage()}
            </Nav>
        </Navbar>
      );
  }
}

export default NavigationBar;