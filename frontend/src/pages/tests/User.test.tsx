import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import User, { USER_QUERY } from "../User";

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
      query: USER_QUERY,
      variables: { id: 1 },
    },
    result: {
      data: {
        user: {
          id: 1,
          username: "username",
          posts: [
            {
              __typename: "Post",
              id: 1,
              title: "title1",
              numComments: 1,
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
            },
            {
              __typename: "Post",
              id: 2,
              title: "title2",
              numComments: 1,
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
            },
            {
              __typename: "Post",
              id: 3,
              title: "title3",
              numComments: 1,
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
            },
          ],
          comments: [
            {
              __typename: "Comment",
              id: 1,
              content: "comment1",
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
              post: {
                id: 1,
                title: "title",
              },
            },
            {
              __typename: "Comment",
              id: 2,
              content: "comment2",
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
              post: {
                id: 1,
                title: "title",
              },
            },
            {
              __typename: "Comment",
              id: 3,
              content: "comment3",
              numVotes: 1,
              dateCreated: 1,
              dateUpdated: 1,
              author: {
                id: 1,
                username: "username",
              },
              post: {
                id: 1,
                title: "title",
              },
            },
          ],
        },
      },
    },
  },
];

describe("<User />", () => {
  beforeEach(async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["user/1"]}>
          <Route path="user/:id">
            <MockedProvider mocks={mocks}>
              <User />
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to get user", async () => {
    expect(screen.getAllByText("title1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("title2")[0]).toBeInTheDocument();
    expect(screen.getAllByText("title3")[0]).toBeInTheDocument();
    expect(screen.getAllByText("comment1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("comment2")[0]).toBeInTheDocument();
    expect(screen.getAllByText("comment3")[0]).toBeInTheDocument();
  });
});
