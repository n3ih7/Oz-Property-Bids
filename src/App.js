import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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
        <Route exact path ="/"><Home/></Route>
        <Route exact path ="/login"><Login/></Route>
        <Route path ="/user/:id"></Route>
      </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
