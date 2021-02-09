import "../../pages/tests/node_modules/@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import DeleteModalWithButton from "../DeleteModalWithButton";

test("should call onDelete after deleting", () => {
  const onDelete = jest.fn();
  render(<DeleteModalWithButton onDelete={onDelete} type="comment" />);
  fireEvent.click(screen.getByText("Delete"));
  fireEvent.click(screen.getByText("Yes"));
  expect(onDelete).toHaveBeenCalled();
});
