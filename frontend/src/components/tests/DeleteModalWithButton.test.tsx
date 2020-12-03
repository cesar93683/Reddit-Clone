import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import DeleteModalWithButton from "../DeleteModalWithButton";

test("should call onDelete after deleting", () => {
  const onDelete = jest.fn();

  act(() => {
    render(<DeleteModalWithButton onDelete={onDelete} type="comment" />);
  });
  act(() => {
    fireEvent.click(screen.getByText("Delete"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Yes"));
  });
  expect(onDelete).toHaveBeenCalled();
});
