import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";

const NavBar = () => {
  const isLoggedIn = false;
  const [logInDropDown, setLogInDropDown] = useState(false);
  const [signUpDropDown, setSignUpDropDown] = useState(false);
  const toggleLogInDropDown = () => {
    setLogInDropDown(!logInDropDown);
    setSignUpDropDown(false);
  };
  const toggleSignUpDropDown = () => {
    setSignUpDropDown(!signUpDropDown);
    setLogInDropDown(false);
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
          <div className="NavBar-LogInButton" onClick={toggleLogInDropDown}>
            Log In
          </div>
          <div className="NavBar-SignUpButton" onClick={toggleSignUpDropDown}>
            Sign Up
          </div>
        </div>
      )}
      <LogIn className={logInDropDown ? "NavBar-DropDown" : "d-none"} />
      <SignUp className={signUpDropDown ? "NavBar-DropDown" : "d-none"} />
    </div>
  );
};

export default NavBar;
