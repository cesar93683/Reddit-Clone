import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../utils/auth-context";
import Comment, {
  COMMENT_VOTE_QUERY,
  DELETE_COMMENT_MUTATION,
  EDIT_COMMENT_MUTATION,
  VOTE_COMMENT_MUTATION,
} from "../Comment";

const mocks = [
  {
    request: {
      query: COMMENT_VOTE_QUERY,
      variables: { commentId: 1 },
    },
    result: {
      data: {
        commentVote: { value: 1 },
      },
    },
  },
  {
    request: {
      query: COMMENT_VOTE_QUERY,
      variables: { commentId: 2 },
    },
    result: {
      data: {},
    },
  },
  {
    request: {
      query: DELETE_COMMENT_MUTATION,
      variables: {
        id: 2,
        postId: 1,
      },
    },
    result: {
      data: {
        deleteComment: { message: "Success" },
      },
    },
  },
  {
    request: {
      query: EDIT_COMMENT_MUTATION,
      variables: {
        id: 2,
        content: "content",
      },
    },
    result: {
      data: {
        editComment: { id: 1 },
      },
    },
  },
  {
    request: {
      query: VOTE_COMMENT_MUTATION,
      variables: {
        commentId: 2,
        value: 1,
      },
    },
    result: {
      data: {
        voteComment: { message: "Success" },
      },
    },
  },
  {
    request: {
      query: VOTE_COMMENT_MUTATION,
      variables: {
        commentId: 2,
        value: -1,
      },
    },
    result: {
      data: {
        voteComment: { message: "Success" },
      },
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
            <Comment
              comment={{
                id: 1,
                author: { id: 1, username: "username" },
                dateCreated: 1,
                dateUpdated: 1,
                content: "content",
                numVotes: 1,
              }}
              currentDate={1}
              postId={1}
              showVoteSection
            />
          </AuthContext.Provider>
        </MockedProvider>
      </Router>
    );
  });
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  expect(screen.getByText("^")).toHaveClass("btn-primary");
});

describe("<Comment />", () => {
  beforeEach(async () => {
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
            <Comment
              comment={{
                id: 2,
                author: { id: 1, username: "username" },
                dateCreated: 1,
                dateUpdated: 1,
                content: "content",
                numVotes: 623,
              }}
              currentDate={1}
              postId={1}
              showVoteSection
            />
          </AuthContext.Provider>
        </MockedProvider>
      </Router>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to delete", async () => {
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("Comment deleted")).toBeInTheDocument();
  });
  test("should be able to edit", async () => {
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText("Enter Comment"), {
      target: { value: "new comment" },
    });
    fireEvent.click(screen.getByText("Update"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("new comment")).toBeInTheDocument();
  });
  test("should be able to increment vote", async () => {
    fireEvent.click(screen.getByText("^"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("624")).toBeInTheDocument();
  });
  test("should be able to decrement vote", async () => {
    fireEvent.click(screen.getByText("v"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("622")).toBeInTheDocument();
  });
});
