import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../shared/context/auth-context";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../GraphQL/Mutation";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

interface AuthProps {
  isLogInMode: boolean;
}

const Auth = ({ isLogInMode }: AuthProps) => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signUp] = useMutation(SIGNUP_MUTATION);
  const [logIn] = useMutation(LOGIN_MUTATION);
  const history = useHistory();

  const authSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!isLogInMode && !username) {
      setError("Please enter your username");
      return;
    }

    if (isLogInMode) {
      await logIn({ variables: { email, password } })
        .then(({ data }) => {
          auth.login(data.logIn.user.id, data.logIn.token, null);
          history.push("/");
        })
        .catch((err) => {
          setError(err);
        });
    } else {
      await signUp({ variables: { email, username, password } })
        .then(({ data }) => {
          auth.login(data.signUp.user.id, data.signUp.token, null);
          history.push("/");
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
    <Form onSubmit={authSubmitHandler}>
      <Form.Label>Email address</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={handleEmail}
      />
      {!isLogInMode && (
        <>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsername}
          />
        </>
      )}
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasssword}
      />
      {error && (
        <Alert className="mt-1 mb-0" variant="danger">
          {error}
        </Alert>
      )}
      <Button className="mt-1" variant="primary" type="submit">
        {isLogInMode ? "Log In" : "Sign Up"}
      </Button>
      <Link className="d-block" to={isLogInMode ? "/signup" : "/login"}>
        {isLogInMode ? "Sign Up Instead" : "Log In Instead"}
      </Link>
    </Form>
  );
};

export default Auth;
