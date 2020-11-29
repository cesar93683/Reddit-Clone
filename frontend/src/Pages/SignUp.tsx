import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../utils/auth-context";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      userId
      error
    }
  }
`;

const SignUp = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signUp] = useMutation(SIGNUP_MUTATION);
  const history = useHistory();

  const signUpSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!username) {
      setError("Please enter your username");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    await signUp({ variables: { email, username, password } })
      .then(({ data }) => {
        if (data.signUp.error) {
          setError(data.signUp.error);
          return;
        }
        auth.login(data.signUp.userId, data.signUp.token);
        history.push("/");
      })
      .catch(() => {});
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
        <Form onSubmit={signUpSubmitHandler}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
            />
          </Form.Group>
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
            Sign Up
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SignUp;