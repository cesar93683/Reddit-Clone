import React from "react";
import "./Navbar.css";

const NavBar = () => {
  const isLoggedIn = false;
  return (
    <div className='NavBar'>
      <div>Home</div>
      {isLoggedIn ? (
        <button>Sign Out</button>
      ) : (
        <div>
          <button>Log In</button>
          <button>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
