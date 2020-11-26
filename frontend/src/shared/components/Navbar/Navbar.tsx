import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Auth from "./Auth/Auth";
import { AuthContext } from "../../context/auth-context";
import { Button, Navbar } from "react-bootstrap";

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
    <Navbar bg="light" variant="light">
      <Link to="/" className="mr-auto">
        <Navbar.Brand>Home</Navbar.Brand>
      </Link>
      {auth.isLoggedIn ? (
        <>
          <Link to="/post/new">
            <Button variant="primary" className="mr-1">
              New Post
            </Button>
          </Link>
          <Button variant="secondary" onClick={auth.logout}>
            Log Out
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline-primary" onClick={toggleLogInMode}>
            Log In
          </Button>
          <Button variant="primary" className="ml-2" onClick={toggleSignUpMode}>
            Sign Up
          </Button>
        </>
      )}
      <Auth
        isLogInMode={logInMode}
        closeDropDown={closeDropDown}
        className={logInMode || signUpMode ? "NavBar-DropDown" : "d-none"}
      />
    </Navbar>
  );
};

export default NavBar;
