import React from "react";
import '../Auth.css'

const LogIn = () => {
  return (
    <div className="Auth">
      <div className="Auth-Title">
        Log In
      </div>
      <form className="Auth-Form">
        <input className="Auth-Input" type="text" id="username" placeholder="Username"></input>
        <input className="Auth-Input" type="password" id="password" placeholder="Password"></input>
        <button className='Auth-Submit'>Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
