import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import EditPost, { EDIT_POST_MUTATION, POST_QUERY } from "../EditPost";

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
    result: () => {
      return {
        data: {
          post: {
            title: "title1",
            content: "content1",
          },
        },
      };
    },
  },
  {
    request: {
      query: EDIT_POST_MUTATION,
      variables: { id: 1, content: "new content2" },
    },
    result: {
      data: { editPost: { id: 1 } },
    },
  },
];

describe("<EditPost />", () => {
  beforeEach(async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["editPost/1"]}>
          <Route path="editPost/:id">
            <MockedProvider mocks={mocks} addTypename={false}>
              <EditPost />
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("should be able to query post", async () => {
    expect(screen.getByDisplayValue("title1")).toBeInTheDocument();
  });
  test("should be able to edit post", async () => {
    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Enter content"), {
        target: { value: "new content2" },
      });
    });
    act(() => {
      fireEvent.click(screen.getByText("Update Post"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(mockHistoryPush).toHaveBeenCalledWith("/post/1");
  });
});
