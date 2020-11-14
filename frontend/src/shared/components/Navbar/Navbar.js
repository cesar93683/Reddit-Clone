import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.scss";
import Auth from "./Auth/Auth";
import { AuthContext } from "../../context/auth-context";

const NavBar = () => {
  const auth = useContext(AuthContext);

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
  const closeDropDown = () => {
    setSignUpMode(false);
    setLogInMode(false);
  };
  return (
    <div className="NavBar">
      <Link className="NavBar-Home" to="/">
        Home
      </Link>
      {auth.isLoggedIn ? (
        <div className="NavBar-RightButtons">
          <Link
            className="btn btn-primary NavBar__NewPostButton"
            to="/post/new"
          >
            New Post
          </Link>
          <button className="btn btn-outline-light" onClick={auth.logout}>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="NavBar-RightButtons">
          <button className="btn btn-light" onClick={toggleLogInMode}>
            Log In
          </button>
          <button
            className="btn btn-outline-light NavBar__SignUpButton"
            onClick={toggleSignUpMode}
          >
            Sign Up
          </button>
        </div>
      )}
      <Auth
        isLogInMode={logInMode}
        closeDropDown={closeDropDown}
        className={logInMode || signUpMode ? "NavBar-DropDown" : "d-none"}
      />
    </div>
  );
};

export default NavBar;
