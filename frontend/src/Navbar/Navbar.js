import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  const isLoggedIn = false;
  return (
    <div className="NavBar">
      <Link to="/">
        <button>Home</button>
      </Link>
      {isLoggedIn ? (
        <Link to="/signout">
          <button>Sign Out</button>
        </Link>
      ) : (
        <div>
          <Link to="/login">
            <button>Log In</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
