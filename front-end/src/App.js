import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends Component{

  render(){
    return(
      <Router>
        <div className="App-background">
        <NavigationBar/>
        <Switch>
          <Route exact path ="/"><Home cookies= {this.props.cookies} /></Route>
          <Route exact path ="/login" ><Login cookies= {this.props.cookies} /></Route>
          <Route path ="/user/:id"></Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default withCookies(App);
