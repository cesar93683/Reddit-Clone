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
      variables: {
        commentId: 1,
      },
    },
    result: {
      data: {
        value: 1,
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
        message: "Success",
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
        id: 1,
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
        message: "Success",
      },
    },
  },
];

describe("<Comment />", () => {
  beforeEach(() => {
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
  test("error is shown when submitting empty comment", async () => {
    expect(screen.getByText("username")).toBeInTheDocument();
  });
});
