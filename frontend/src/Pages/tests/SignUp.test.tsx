import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SignUp, { SIGNUP_MUTATION } from "../SignUp";

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
      query: SIGNUP_MUTATION,
      variables: {
        email: "a@a.com",
        username: "username",
        password: "password",
      },
    },
    result: () => {
      return {
        data: {
          signUp: {
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
      query: SIGNUP_MUTATION,
      variables: {
        email: "b@b.com",
        username: "username",
        password: "password",
      },
    },
    result: () => {
      return {
        data: {
          signUp: {
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
          <SignUp />
        </MockedProvider>
      </Router>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("error should show up if no email entered", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "username" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Please enter your email")).toBeInTheDocument();
  });
  test("error should show up if no username entered", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Please enter your username")).toBeInTheDocument();
  });
  test("error should show up if no password entered", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "username" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Please enter your password")).toBeInTheDocument();
  });
  test("should be able to sign up", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "a@a.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "username" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
  test("error should show up if from mutation", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "b@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "username" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
