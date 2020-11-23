import React, { useContext, useState } from "react";
import "./Auth.scss";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../../context/auth-context";

const LOGIN_MUTATION = gql`
  mutation logIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

interface AuthProps {
  isLogInMode: boolean;
  closeDropDown: () => void;
  className: string;
}

const Auth = (props: AuthProps) => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signUp] = useMutation(SIGNUP_MUTATION);
  const [logIn] = useMutation(LOGIN_MUTATION);

  const authSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!props.isLogInMode && !username) {
      setError("Please enter your username");
      return;
    }

    if (props.isLogInMode) {
      try {
        await logIn({ variables: { email, password } })
          .then(({ data }) => {
            auth.login(data.logIn.user.id, data.logIn.token, null);
            props.closeDropDown();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        setError(err);
      }
    } else {
      await signUp({ variables: { email, username, password } })
        .then(({ data }) => {
          auth.login(data.signUp.user.id, data.signUp.token, null);
          props.closeDropDown();
        })
        .catch((err) => {
          setError(err);
        });
    }
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasssword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={"Auth Form " + props.className}>
      <div className="Form__Title">
        {props.isLogInMode ? "Log In" : "Sign Up"}
      </div>
      <form className="Form__Form" onSubmit={authSubmitHandler}>
        <label className="text-light" htmlFor="email">
          Email address
        </label>
        <input
          placeholder="Email"
          className="Form__Input"
          type="email"
          id="email"
          value={email}
          onChange={handleEmail}
        />
        {!props.isLogInMode && (
          <React.Fragment>
            <label className="text-light" htmlFor="username">
              Username
            </label>
            <input
              placeholder="Username"
              className="Form__Input"
              id="username"
              type="text"
              value={username}
              onChange={handleUsername}
            />
          </React.Fragment>
        )}
        <label className="text-light" htmlFor="password">
          Password
        </label>
        <input
          placeholder="Password"
          className="Form__Input"
          id="password"
          type="password"
          value={password}
          onChange={handlePasssword}
        />
        {error && <div className="text-light">{error}</div>}
        <button className="btn btn-primary">
          {props.isLogInMode ? "Log In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
