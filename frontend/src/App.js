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
        <main className="App">{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
