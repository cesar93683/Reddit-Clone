import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.scss";
import Auth from "./Auth/Auth";
import { AuthContext } from "../../context/auth-context";

const NavBar = () => {
  const token = localStorage.getItem("token");
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
      {token ? (
        <div className="d-flex">
          <Link className="btn btn-primary mr-3" to="/post/new">
            New Post
          </Link>
          <button className="btn btn-outline-light" onClick={auth.logout}>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="d-flex">
          <button className="btn btn-light" onClick={toggleLogInMode}>
            Log In
          </button>
          <button
            className="btn btn-outline-light ml-2"
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
