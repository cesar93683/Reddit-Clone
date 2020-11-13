import React, { useContext, useState } from "react";
import "./Auth.css";

import { useHttpClient } from "../../../hooks/http-hook";
import { AuthContext } from "../../../context/auth-context";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (props.isLogInMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email,
            password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        props.closeDropDown();
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            email,
            username,
            password,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.userId, responseData.token);
        props.closeDropDown();
      } catch (err) {}
    }
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePasssword = (event) => {
    setPassword(event.target.value);
  };

  if (isLoading)
    return (
      <div className={"Auth " + props.className}>
        <LoadingSpinner />
      </div>
    );

  return (
    <div className={"Auth " + props.className}>
      <div className="Auth-Title">
        {props.isLogInMode ? "Log In" : "Sign Up"}
      </div>
      <form className="Auth-Form" onSubmit={authSubmitHandler}>
        <input type="email" value={email} onChange={handleEmail} />
        {!props.isLogInMode && (
          <input type="text" value={username} onChange={handleUsername} />
        )}
        <input type="password" value={password} onChange={handlePasssword} />
        {error && <div className="Auth-Error">{error}</div>}
        <button className="Auth-Submit">
          {props.isLogInMode ? "Log In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
