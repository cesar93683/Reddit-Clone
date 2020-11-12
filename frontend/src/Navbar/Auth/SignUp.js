import React from "react";
import "./Auth.css";

const SignUp = () => {
  return (
    <div className="Auth center">
      <div className="Auth-Title">Sign Up</div>
      <form className="Auth-Form">
        <input
          className="Auth-Input"
          type="text"
          id="email"
          placeholder="Email"
        ></input>
        <input
          className="Auth-Input"
          type="text"
          id="username"
          placeholder="Username"
        ></input>
        <input
          className="Auth-Input"
          type="password"
          id="password"
          placeholder="Password"
        ></input>
        <button className="Auth-Submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
