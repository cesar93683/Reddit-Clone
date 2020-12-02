import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import React from "react";
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
        id: 3,
        postId: 4,
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
        id: 5,
        content: "content",
      },
    },
    result: {
      data: {
        editComment: { id: 6 },
      },
    },
  },
  {
    request: {
      query: VOTE_COMMENT_MUTATION,
      variables: {
        commentId: 7,
        value: 8,
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
  beforeEach(() => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: 1, token: "token" })
    );
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
  test("should be able to set curr vote from query", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    screen.debug();
    expect(screen.getByText("^")).toHaveClass("btn-primary");
  });
});
// should increment votes
// should decrement vote
// should be able to edit
// should be able to delete
// should not give error if user has not voted
