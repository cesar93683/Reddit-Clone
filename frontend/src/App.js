import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NavBar from "./shared/components//Navbar/Navbar";
import Home from "./Home/Home";
import "./App.css";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
