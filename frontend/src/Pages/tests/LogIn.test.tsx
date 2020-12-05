import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import LogIn, { LOGIN_MUTATION } from "../LogIn";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as object),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mocks = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: "a@a.com",
        password: "password",
      },
    },
    result: () => {
      return {
        data: {
          logIn: {
            token: "token",
            userId: 1,
            error: "",
          },
        },
      };
    },
  },
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: "b@b.com",
        password: "password",
      },
    },
    result: () => {
      return {
        data: {
          logIn: {
            token: "",
            userId: 1,
            error: "Error",
          },
        },
      };
    },
  },
];

describe("<Home />", () => {
  beforeEach(async () => {
    render(
      <Router>
        <MockedProvider mocks={mocks} addTypename={false}>
          <LogIn />
        </MockedProvider>
      </Router>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("error should show up if no email entered", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Log In"));
    expect(screen.getByText("Please enter your email")).toBeInTheDocument();
  });
  test("error should show up if no password entered", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "email" },
    });
    fireEvent.click(screen.getByText("Log In"));
    expect(screen.getByText("Please enter your password")).toBeInTheDocument();
  });
  test("should be able to login", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "a@a.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Log In"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
  test("error should show up if from mutation", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "b@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Log In"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
