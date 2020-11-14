import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
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
        <div>
          <Link className="btn btn-blue NavBar__NewPostButton" to="/post/new">
            New Post
          </Link>
          <div className="btn btn-outline-white" onClick={auth.logout}>
            Sign Out
          </div>
        </div>
      ) : (
        <div className="NavBar-Auth">
          <div className="btn btn-white" onClick={toggleLogInMode}>
            Log In
          </div>
          <div
            className="btn btn-outline-white NavBar__SignUpButton"
            onClick={toggleSignUpMode}
          >
            Sign Up
          </div>
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
