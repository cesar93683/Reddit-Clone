import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar } from "react-bootstrap";
import { AuthContext } from "../utils/auth-context";

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Link to="/" className="mr-auto">
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/post/new">
              <Button variant="primary" className="mr-1">
                New Post
              </Button>
            </Link>
            <Button variant="secondary" onClick={logout}>
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
      </Container>
    </Navbar>
  );
};

export default NavBar;
