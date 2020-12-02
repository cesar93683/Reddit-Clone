import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../../utils/auth-context";
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
      query: DELETE_COMMENT_MUTATION,
      variables: {
        id: 1,
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
        id: 1,
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
        commentId: 1,
        value: 1,
      },
    },
    result: {
      data: {
        voteComment: { message: "Success" },
      },
    },
  },
];

describe("<Comment />", () => {
  beforeEach(async () => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: 1, token: "token" })
    );
    act(() => {
      render(
        <Router>
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider>
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
            </AuthProvider>
          </MockedProvider>
        </Router>
      );
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to set curr vote from query", async () => {
    expect(screen.getByText("^")).toHaveClass("btn-primary");
  });
  test("should be able to delete", async () => {
    act(() => {
      fireEvent.click(screen.getByText("Delete"));
    });
    act(() => {
      fireEvent.click(screen.getByText("Yes"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText("Comment deleted")).toBeInTheDocument();
  });
});
// should increment votes
// should decrement vote
// should be able to edit
// should not give error if user has not voted
