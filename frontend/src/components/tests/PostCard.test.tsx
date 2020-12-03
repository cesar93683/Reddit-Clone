import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../utils/auth-context";
import PostCard, { POST_VOTE_QUERY, VOTE_POST_MUTATION } from "../PostCard";

const onDelete = jest.fn();

const mocks = [
  {
    request: {
      query: POST_VOTE_QUERY,
      variables: { postId: 1 },
    },
    result: () => {
      return {
        data: {
          postVote: { value: 1 },
        },
      };
    },
  },
  {
    request: {
      query: POST_VOTE_QUERY,
      variables: { postId: 2 },
    },
    result: {
      data: {},
    },
  },
  {
    request: {
      query: VOTE_POST_MUTATION,
      variables: { postId: 2, value: 1 },
    },
    result: {
      data: { message: "Success" },
    },
  },
  {
    request: {
      query: VOTE_POST_MUTATION,
      variables: { postId: 2, value: -1 },
    },
    result: {
      data: { message: "Success" },
    },
  },
];

test("should be able to set curr vote from query", async () => {
  act(() => {
    render(
      <Router>
        <MockedProvider mocks={mocks} addTypename={false}>
          <AuthContext.Provider
            value={{
              userId: 1,
              token: "token",
              login: (userId: number, token: string) => {},
              logout: () => {},
            }}
          >
            <PostCard
              post={{
                id: 1,
                title: "title",
                content: "content",
                author: { id: 1, username: "username" },
                numComments: 0,
                numVotes: 0,
                dateCreated: 1,
                dateUpdated: 1,
              }}
              currentDate={1}
            />
          </AuthContext.Provider>
        </MockedProvider>
      </Router>
    );
  });
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  screen.debug();
  expect(screen.getByText("^")).toHaveClass("btn-primary");
});

describe("<PostCard />", () => {
  beforeEach(async () => {
    act(() => {
      render(
        <Router>
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthContext.Provider
              value={{
                userId: 2,
                token: "token",
                login: (userId: number, token: string) => {},
                logout: () => {},
              }}
            >
              <PostCard
                post={{
                  id: 2,
                  title: "title",
                  content: "content",
                  author: { id: 2, username: "username" },
                  numComments: 0,
                  numVotes: 623,
                  dateCreated: 1,
                  dateUpdated: 1,
                }}
                currentDate={1}
                onDelete={onDelete}
              />
            </AuthContext.Provider>
          </MockedProvider>
        </Router>
      );
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to delete", async () => {
    act(() => {
      fireEvent.click(screen.getByText("Delete"));
    });
    act(() => {
      fireEvent.click(screen.getByText("Yes"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(onDelete).toHaveBeenCalledWith();
  });
  test("should be able to increment vote", async () => {
    act(() => {
      fireEvent.click(screen.getByText("^"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("624")).toBeInTheDocument();
  });
  test("should be able to decrement vote", async () => {
    act(() => {
      fireEvent.click(screen.getByText("v"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("622")).toBeInTheDocument();
  });
});
