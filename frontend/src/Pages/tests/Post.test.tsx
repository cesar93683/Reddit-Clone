import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { COMMENT_VOTE_QUERY } from "../../components/Comment";
import { POST_VOTE_QUERY } from "../../components/PostCard";
import { AuthContext } from "../../utils/auth-context";
import Post, {
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  POST_QUERY,
} from "../Post";

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
      query: POST_QUERY,
      variables: { id: 1 },
    },
    result: {
      data: {
        post: {
          id: 1,
          title: "title",
          content: "post content",
          numComments: 1,
          numVotes: 1,
          dateCreated: 1,
          dateUpdated: 1,
          author: {
            id: 1,
            username: "username",
          },
          comments: [
            {
              id: 1,
              content: "comment content",
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_COMMENT_MUTATION,
      variables: {
        postId: 1,
        content: "comment content 2",
      },
    },
    result: {
      data: {
        createComment: {
          id: 2,
          content: "comment content 2",
          numVotes: 1,
          dateCreated: 1,
          dateUpdated: 1,
          author: {
            id: 1,
            username: "username",
          },
        },
      },
    },
  },
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: { id: 1 },
    },
    result: {
      deletePost: {
        message: "Success",
      },
    },
  },
  {
    request: {
      query: COMMENT_VOTE_QUERY,
      variables: { commentId: 1 },
    },
    result: {
      data: {},
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
];

describe("<Post />", () => {
  beforeEach(async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["post/1"]}>
          <Route path="post/:id">
            <AuthContext.Provider
              value={{
                userId: 1,
                token: "token",
                login: (userId: number, token: string) => {},
                logout: () => {},
              }}
            >
              <MockedProvider mocks={mocks} addTypename={false}>
                <Post />
              </MockedProvider>
            </AuthContext.Provider>
          </Route>
        </MemoryRouter>
      );
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to get post", async () => {
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("post content")).toBeInTheDocument();
    expect(screen.getByText("comment content")).toBeInTheDocument();
  });
  test("should be able to create comment", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter Comment"), {
      target: { value: "comment content 2" },
    });
    fireEvent.click(screen.getByText("Comment"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getAllByText("comment content 2")[0]).toBeInTheDocument();
  });
  test("should be able to delete post", async () => {
    fireEvent.click(screen.getAllByText("Delete")[0]);
    fireEvent.click(screen.getByText("Yes"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
});
