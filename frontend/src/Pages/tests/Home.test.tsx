import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Home, {
  POSTS_BY_DATE_CREATED_QUERY,
  POSTS_BY_NUM_VOTES_QUERY,
} from "../Home";

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
      query: POSTS_BY_DATE_CREATED_QUERY,
      variables: {},
    },
    result: () => {
      return {
        data: {
          posts: {
            posts: [
              {
                id: 3,
                title: "title3",
                numComments: 1,
                numVotes: 3,
                dateCreated: 3,
                dateUpdated: 3,
                author: {
                  id: 1,
                  username: "username",
                },
              },
              {
                id: 1,
                title: "title1",
                numComments: 1,
                numVotes: 5,
                dateCreated: 2,
                dateUpdated: 2,
                author: {
                  id: 1,
                  username: "username",
                },
              },
              {
                id: 2,
                title: "title2",
                numComments: 1,
                numVotes: 2,
                dateCreated: 1,
                dateUpdated: 1,
                author: {
                  id: 1,
                  username: "username",
                },
              },
            ],
            hasMore: false,
            cursor: 3,
          },
        },
      };
    },
  },
  {
    request: {
      query: POSTS_BY_NUM_VOTES_QUERY,
      variables: {},
    },
    result: () => {
      return {
        data: {
          posts: {
            posts: [
              {
                id: 1,
                title: "title1",
                numComments: 1,
                numVotes: 5,
                dateCreated: 2,
                dateUpdated: 2,
                author: {
                  id: 1,
                  username: "username",
                },
              },
              {
                id: 3,
                title: "title3",
                numComments: 1,
                numVotes: 3,
                dateCreated: 3,
                dateUpdated: 3,
                author: {
                  id: 1,
                  username: "username",
                },
              },
              {
                id: 2,
                title: "title2",
                numComments: 1,
                numVotes: 2,
                dateCreated: 1,
                dateUpdated: 1,
                author: {
                  id: 1,
                  username: "username",
                },
              },
            ],
            hasMore: false,
            cursor: 2,
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
          <Home />
        </MockedProvider>
      </Router>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to query posts", async () => {
    expect(screen.getByText("title1")).toBeInTheDocument();
    expect(screen.getByText("title2")).toBeInTheDocument();
    expect(screen.getByText("title3")).toBeInTheDocument();
  });
  test("should be able to sort posts by votes", async () => {
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Votes"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const posts = screen.getAllByTestId("post");
    expect(posts[0]).toHaveTextContent("title1");
    expect(posts[1]).toHaveTextContent("title3");
    expect(posts[2]).toHaveTextContent("title2");
  });
  test("should be able to sort posts by new", async () => {
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Votes"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Date Posted"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const posts = screen.getAllByTestId("post");
    expect(posts[0]).toHaveTextContent("title3");
    expect(posts[1]).toHaveTextContent("title1");
    expect(posts[2]).toHaveTextContent("title2");
  });
});
