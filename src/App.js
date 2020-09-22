import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component{
  render(){
    return(
    <Router>
      <NavigationBar/>
      <Switch>
        <Route exact path ="/"><Home/></Route>
        <Route exact path ="/login"></Route>
        <Route path ="/user/:id"></Route>
      </Switch>
    </Router>
    );
  }
}

export default App;
