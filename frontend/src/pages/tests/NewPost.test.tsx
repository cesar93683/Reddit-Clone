import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import NewPost, { NEW_POST_MUTATION } from "../NewPost";

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
      query: NEW_POST_MUTATION,
      variables: { title: "title", content: "content" },
    },
    result: () => {
      return {
        data: {
          createPost: {
            id: 1,
          },
        },
      };
    },
  },
  {
    request: {
      query: NEW_POST_MUTATION,
      variables: { title: "title", content: "" },
    },
    result: () => {
      return {
        data: {
          createPost: {
            id: 1,
          },
        },
      };
    },
  },
];

describe("<NewPost />", () => {
  beforeEach(async () => {
    render(
      <MemoryRouter initialEntries={["post/1"]}>
        <Route path="post/:id">
          <MockedProvider mocks={mocks} addTypename={false}>
            <NewPost />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to create post", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter content"), {
      target: { value: "content" },
    });
    fireEvent.click(screen.getByText("New Post"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(mockHistoryPush).toHaveBeenCalledWith("/post/1");
  });
  test("should be able to create post with no content", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "title" },
    });
    fireEvent.click(screen.getByText("New Post"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(mockHistoryPush).toHaveBeenCalledWith("/post/1");
  });
  test("should give error if no title", async () => {
    fireEvent.change(screen.getByPlaceholderText("Enter content"), {
      target: { value: "content" },
    });
    fireEvent.click(screen.getByText("New Post"));
    expect(screen.getByText("Please enter a title")).toBeInTheDocument();
  });
});
