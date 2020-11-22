import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NavBar from "./shared/components/Navbar/Navbar";
import Post from "./Posts/pages/Post";
import Home from "./Home/Home";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import NewPost from "./Posts/pages/NewPost";
import EditPost from "./Posts/pages/EditPost";
import User from "./User/User";
import "./App.scss";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = new HttpLink({ uri: "http://localhost:4000" });
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem("token");

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
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <NavBar />
        <main className="App">{routes}</main>
      </Router>
    </ApolloProvider>
  );
};

export default App;
