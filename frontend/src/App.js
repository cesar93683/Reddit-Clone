import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import NavBar from "./Navbar/Navbar";
import SignUp from "./Auth/SignUp";
import LogIn from "./Auth/LogIn";
import Home from "./Home/Home";
import './App.css'


const App = () => {
  return <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Route path="/login" exact>
          <LogIn />
        </Route>        
        <Redirect to="/" />
      </Switch>
  </Router>
};

export default App;
