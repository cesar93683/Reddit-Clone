import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Post from "./Pages/Post";
import Home from "./Pages/Home";
import NewPost from "./Pages/NewPost";
import { AuthProvider } from "./utils/auth-hook";
import EditPost from "./Pages/EditPost";
import User from "./Pages/User";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "apollo-link-context";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import { Container } from "react-bootstrap";
import NavBar from "./components/Navbar";

const httpLink = new HttpLink({ uri: "http://localhost:4000" });
const authLink = setContext(async (req, { headers }) => {
  const token = JSON.parse(localStorage.getItem("userData") || "{}").token;

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <NavBar />
          <Container>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/post/new" component={NewPost} exact />
              <Route path="/posts/:id" component={Post} exact />
              <Route path="/posts/:id/edit" component={EditPost} exact />
              <Route path="/users/:id" component={User} exact />
              <Route path="/login" component={LogIn} exact />
              <Route path="/signup" component={SignUp} exact />
              <Redirect to="/" />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}
