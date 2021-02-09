import { MockedProvider } from "@apollo/client/testing";
import "../../pages/tests/node_modules/@testing-library/jest-dom/extend-expect";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { POSTS_BY_DATE_CREATED_QUERY } from "../../pages/Home";
import Posts from "../Posts";

const mocks2 = [
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
            ],
            hasMore: true,
            cursor: 1,
          },
        },
      };
    },
  },
  {
    request: {
      query: POSTS_BY_DATE_CREATED_QUERY,
      variables: { cursor: 1 },
    },
    result: () => {
      return {
        data: {
          posts: {
            posts: [
              {
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
            ],
            hasMore: true,
            cursor: 2,
          },
        },
      };
    },
  },
];

test("should be able to query posts and get more posts", async () => {
  render(
    <Router>
      <MockedProvider mocks={mocks2} addTypename={false}>
        <Posts currentDate={0} query={POSTS_BY_DATE_CREATED_QUERY} />
      </MockedProvider>
    </Router>
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  expect(screen.getByText("title1")).toBeInTheDocument();
  fireEvent.click(screen.getByText("More Posts"));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  expect(screen.getByText("title2")).toBeInTheDocument();
});
