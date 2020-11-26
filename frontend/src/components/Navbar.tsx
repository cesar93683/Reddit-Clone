import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
import { AuthContext } from "../utils/auth-context";

const NavBar = () => {
  const auth = useContext(AuthContext);

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
          <Link to="/login">
            <Button variant="primary" className="mr-1">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline-primary">Sign Up</Button>
          </Link>
        </>
      )}
    </Navbar>
  );
};

export default NavBar;
