import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import Auth from "./Auth/Auth";

const NavBar = () => {
  const isLoggedIn = false;
  const [logInMode, setLogInMode] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const toggleLogInMode = () => {
    setLogInMode(!logInMode);
    setSignUpMode(false);
  };
  const toggleSignUpMode = () => {
    setSignUpMode(!signUpMode);
    setLogInMode(false);
  };
  return (
    <div className="NavBar">
      <Link className="NavBar-Home" to="/">
        Home
      </Link>
      {isLoggedIn ? (
        <Link to="/signout">
          <button>Sign Out</button>
        </Link>
      ) : (
        <div className="NavBar-Auth">
          <div className="NavBar-LogInButton" onClick={toggleLogInMode}>
            Log In
          </div>
          <div className="NavBar-SignUpButton" onClick={toggleSignUpMode}>
            Sign Up
          </div>
        </div>
      )}
      <Auth
        isLogInMode={logInMode}
        className={logInMode || signUpMode ? "NavBar-DropDown" : "d-none"}
      />
    </div>
  );
};

export default NavBar;
