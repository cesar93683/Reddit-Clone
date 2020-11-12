import React, { useContext } from "react";
import "./Auth.css";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import Input from "../../Input/Input";

const SignUp = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          username: formState.inputs.username.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(responseData.userId, responseData.token);
    } catch (err) {}
  };

  return (
    <div className={"Auth " + props.className}>
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="Auth-Title">Sign Up</div>
      <form className="Auth-Form" onSubmit={authSubmitHandler}>
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="username"
          type="text"
          label="Username"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a username."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 6 characters."
          onInput={inputHandler}
        />
        <button className="Auth-Submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
