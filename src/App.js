import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login';
import LogOut from './pages/LogOut';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Results from './pages/Results';
import SellerHome from './pages/SellHome';
import Upload from './pages/Upload';
import PropertyBid from './pages/PropertyBid';
import RegisteredHomes from './pages/RegisteredHomes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



class App extends Component{

  constructor(props){
    super(props);

    this.state ={
      searchResults : [],
      searchParams: null,
      property: null
    }

    this.retrieveSearchResults = this.retrieveSearchResults.bind(this);
    this.retrieveSearchParams = this.retrieveSearchParams.bind(this);
    this.retrieveHouseFromResults = this.retrieveHouseFromResults.bind(this);
  }

  retrieveSearchResults = (results) => {
    this.setState({
      searchResults : results.resp
    });
  }

  retrieveSearchParams = (params) => {
    this.setState({
      searchParams : params
    });
  }

  retrieveHouseFromResults(propertyDetails){
    this.setState({
      property : propertyDetails
    });
  }

  render(){
    return(
      <Router>
        <div className="App-background">
          <NavigationBar cookies = {this.props.cookies}/>
          <Switch>
            <Route exact path ="/"><Home cookies= {this.props.cookies} dataCallback={this.retrieveSearchResults.bind(this)} paramsCallback={this.retrieveSearchParams.bind(this)} retrieveHouse ={this.retrieveHouseFromResults.bind(this)}/></Route>
            <Route exact path ="/login" ><Login cookies= {this.props.cookies} /></Route>
            <Route exact path ="/logout" ><LogOut cookies= {this.props.cookies} /></Route>
            <Route exact path="/signup"><SignUp  cookies = {this.props.cookies}/></Route>
            <Route exact path="/account"><Account cookies = {this.props.cookies}/></Route>
            <Route exact path="/sell"><SellerHome cookies = {this.props.cookies} retrieveHouse ={this.retrieveHouseFromResults.bind(this)}/></Route>
            <Route exact path="/registrations"><RegisteredHomes cookies = {this.props.cookies} retrieveHouse ={this.retrieveHouseFromResults.bind(this)}/></Route>
            <Route exact path="/upload"><Upload cookies = {this.props.cookies}/></Route>
            <Route exact path="/house"><PropertyBid propertyDetails={this.state.property} cookies = {this.props.cookies} retrieveHouse ={this.retrieveHouseFromResults.bind(this)}/></Route>
            <Route exact path="/results"><Results cookies = {this.props.cookies} results={this.state.searchResults} firstSearchParams={this.state.searchParams} retrieveHouse ={this.retrieveHouseFromResults.bind(this)}/></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withCookies(App);
