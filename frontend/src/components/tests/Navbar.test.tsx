import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../utils/auth-context";
import Navbar from "../Navbar";

test("Should call logout", async () => {
  const logout = jest.fn();
  render(
    <Router>
      <AuthContext.Provider
        value={{
          userId: 1,
          token: "token",
          login: (userId: number, token: string) => {},
          logout,
        }}
      >
        <Navbar />
      </AuthContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Log Out"));
  expect(logout).toHaveBeenCalled();
});
