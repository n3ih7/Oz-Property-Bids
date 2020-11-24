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
            <Nav.Link href="/registrations" onClick={ () =>{localStorage.clear()}}>Registered Auctions</Nav.Link>
        </>
      );
    }
    else if ((this.cookies.get("authenticated") === "true") && (this.cookies.get("userType") === "seller")){
      return(
        <>
            <Nav.Link href="/sell" onClick={ () =>{localStorage.clear()}}>Sell Houses</Nav.Link>
        </>
      );
    }
  }
  
  accountPage(){
    if(this.cookies.get("authenticated") === "true"){
      return(
        <>
        <Nav.Link className = "ml-auto" href="/account" onClick={ () =>{localStorage.clear()}}>My Account</Nav.Link>
        <Nav.Link href="/logout" onClick={ () =>{localStorage.clear()}}>Log Out</Nav.Link>
        </>
      );
    }
    else{
      return(
      <>
        <Nav.Link className = "ml-auto" href="/login" onClick={ () =>{localStorage.clear()}}>Login</Nav.Link>
        <Nav.Link href="/signup" onClick={ () =>{localStorage.clear()}}>Sign Up!</Nav.Link>
      </>
      );
    }

  }

  render(){
      return(
          <Navbar bg="light" variant="light">
          <Navbar.Brand href="/" onClick={ () =>{localStorage.clear()}}>Oz Property Bids</Navbar.Brand>
            <Nav className="container-fluid" >
              {this.userOnlyOptions()}
              {this.accountPage()}
            </Nav>
        </Navbar>
      );
  }
}

export default NavigationBar;