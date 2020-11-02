import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';

class NavigationBar extends Component{

  constructor(props){
    super(props);
    this.cookies = this.props.cookies;

    this.accountPage = this.accountPage.bind(this);
    this.userOnlyOptions = this.userOnlyOptions.bind(this);
  }
  
  userOnlyOptions(){
    if((this.cookies.get("authenticated") === "true") && (this.cookies.get("userType") === "bidder")){
      return(
        <>
            <Nav.Link href="/saved">Saved Houses</Nav.Link>
        </>
      );
    }
    else if ((this.cookies.get("authenticated") === "true") && (this.cookies.get("userType") === "seller")){
      return(
        <>
            <Nav.Link href="/sell">Sell Houses</Nav.Link>
        </>
      );
    }
  }
  
  accountPage(){
    if(this.cookies.get("authenticated") === "true"){
      return(
        <>
        <Nav.Link className = "ml-auto" href="/account">My Account</Nav.Link>
        <Nav.Link href="/logout">Log Out</Nav.Link>
        </>
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
          <Navbar.Brand href="/">Oz Property Bids</Navbar.Brand>
            <Nav className="container-fluid" >
              {this.userOnlyOptions()}
              {this.accountPage()}
            </Nav>
        </Navbar>
      );
  }
}

export default NavigationBar;