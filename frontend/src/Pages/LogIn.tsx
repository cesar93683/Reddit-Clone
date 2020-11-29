import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../utils/auth-context";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation logIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      userId
      error
    }
  }
`;

export default function LogIn() {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logIn] = useMutation(LOGIN_MUTATION);
  const history = useHistory();

  const logInSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    await logIn({ variables: { email, password } })
      .then(({ data }) => {
        if (data.logIn.error) {
          setError(data.logIn.error);
          return;
        }
        auth.login(data.logIn.userId, data.logIn.token);
        history.push("/");
      })
      .catch(() => {});
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  return (
    <Row className="justify-content-md-center">
      <Col xl={6} lg={8}>
        <Form onSubmit={logInSubmitHandler}>
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
            Log In
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
