import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Post from "./Pages/Post/Post";
import Home from "./Pages/Home";
import NewPost from "./Pages/NewPost";
import { AuthContext } from "./utils/auth-context";
import { useAuth } from "./utils/auth-hook";
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
});

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/post/new" exact>
          <NewPost />
        </Route>
        <Route path="/posts/:postId" exact>
          <Post />
        </Route>
        <Route path="/posts/:postId/edit" exact>
          <EditPost />
        </Route>
        <Route path="/users/:userId" exact>
          <User />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/posts/:postId" exact>
          <Post />
        </Route>
        <Route path="/users/:userId" exact>
          <User />
        </Route>
        <Route path="/login" exact>
          <LogIn />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <NavBar />
          <Container>{routes}</Container>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
