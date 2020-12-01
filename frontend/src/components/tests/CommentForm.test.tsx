import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import CommentForm from "../CommentForm";

test("error is shown when submitting empty comment", async () => {
  render(<CommentForm onSubmit={() => {}} />);
  fireEvent.click(screen.getByText("Comment"));
  expect(screen.getByText("Please Enter A Comment.")).toBeInTheDocument();
});

test("calls 'onSubmit' when form submitted", async () => {
  const onSubmit = jest.fn();
  render(<CommentForm onSubmit={onSubmit} />);
  const testComment = "test comment";
  fireEvent.change(screen.getByPlaceholderText("Enter Comment"), {
    target: { value: testComment },
  });
  fireEvent.click(screen.getByText("Comment"));
  expect(onSubmit).toHaveBeenCalledWith(testComment);
});
