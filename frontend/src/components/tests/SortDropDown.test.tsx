import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import SortDropDown from "../SortDropDown";

const sortByVotes = jest.fn();
const sortByNew = jest.fn();

describe("<SortDropDown />", () => {
  beforeEach(() => {
    render(
      <SortDropDown
        sortByVotes={sortByVotes}
        topActive={false}
        sortByNew={sortByNew}
        newActive
      />
    );
  });
  test("should call sortByVotes", async () => {
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Top"));
    expect(sortByVotes).toHaveBeenCalled();
  });
  test("should call sortByNew", async () => {
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("New"));
    expect(sortByNew).toHaveBeenCalled();
  });
});
