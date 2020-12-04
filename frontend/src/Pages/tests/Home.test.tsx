import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import Home, { POSTS_QUERY } from "../Home";

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
      query: POSTS_QUERY,
      variables: {},
    },
    result: () => {
      return {
        data: {
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
          ],
        },
      };
    },
  },
];

describe("<Home />", () => {
  beforeEach(async () => {
    act(() => {
      render(
        <Router>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Home />
          </MockedProvider>
        </Router>
      );
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to query posts", async () => {
    expect(screen.getByText("title1")).toBeInTheDocument();
    expect(screen.getByText("title2")).toBeInTheDocument();
    expect(screen.getByText("title3")).toBeInTheDocument();
  });
  test("should be able to sort posts by votes", async () => {
    act(() => {
      fireEvent.click(screen.getByText("Sort By"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    act(() => {
      fireEvent.click(screen.getByText("Top"));
    });
    const posts = screen.getAllByTestId("post");
    expect(posts[0]).toHaveTextContent("title1");
    expect(posts[1]).toHaveTextContent("title3");
    expect(posts[2]).toHaveTextContent("title2");
  });
  test("should be able to sort posts by new", async () => {
    act(() => {
      fireEvent.click(screen.getByText("Sort By"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    act(() => {
      fireEvent.click(screen.getByText("New"));
    });
    const posts = screen.getAllByTestId("post");
    expect(posts[0]).toHaveTextContent("title3");
    expect(posts[1]).toHaveTextContent("title1");
    expect(posts[2]).toHaveTextContent("title2");
  });
});
