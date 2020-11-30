import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "apollo-link-context";
import React from "react";
import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import NavBar from "./components/Navbar";
import EditPost from "./pages/EditPost";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import SignUp from "./pages/SignUp";
import User from "./pages/User";
import { AuthProvider } from "./utils/auth-context";

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
              <Route path="/post/:id" component={Post} exact />
              <Route path="/post/:id/edit" component={EditPost} exact />
              <Route path="/user/:id" component={User} exact />
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
