import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../utils/auth-context";
import Navbar from "../Navbar";

test("Should call logout", async () => {
  const logout = jest.fn();
  act(() => {
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
  });
  act(() => {
    fireEvent.click(screen.getByText("Log Out"));
  });
  expect(logout).toHaveBeenCalled();
});
