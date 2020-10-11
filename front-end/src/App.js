import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends Component{

  render(){
    return(
      <Router>
        <div className="App-background">
        <NavigationBar cookies = {this.props.cookies}/>
        <Switch>
          <Route exact path ="/"><Home cookies= {this.props.cookies} /></Route>
          <Route exact path ="/login" ><Login cookies= {this.props.cookies} /></Route>
          <Route exact path="/signup"><SignUp cookies = {this.props.cookies}/></Route>
          <Route exact path="/account"><Account cookies = {this.props.cookies}/></Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default withCookies(App);
