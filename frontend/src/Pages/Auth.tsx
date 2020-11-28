import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../utils/auth-context";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../GraphQL/Mutation";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

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
          setError(err.message);
        });
    } else {
      await signUp({ variables: { email, username, password } })
        .then(({ data }) => {
          auth.login(data.signUp.user.id, data.signUp.token, null);
          history.push("/");
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  return (
    <Row className="justify-content-md-center">
      <Col xl={6} lg={8}>
        <Form onSubmit={authSubmitHandler}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          {!isLogInMode ? (
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={handleUsernameChange}
              />
            </Form.Group>
          ) : null}
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePassswordChange}
            />
          </Form.Group>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Button className="mt-1" variant="primary" type="submit">
            {isLogInMode ? "Log In" : "Sign Up"}
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Auth;
