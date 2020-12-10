import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import SortDropDown from "../SortDropDown";

const onSortByVotes = jest.fn();
const onSortByNew = jest.fn();

describe("<SortDropDown />", () => {
  beforeEach(() => {
    render(
      <SortDropDown
        onSortByVotes={onSortByVotes}
        votesActive={false}
        onSortByDatePosted={onSortByNew}
        datePostedActive
      />
    );
  });
  test("should call sortByVotes", async () => {
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Votes"));
    expect(onSortByVotes).toHaveBeenCalled();
  });
  test("should call sortByNew", async () => {
    fireEvent.click(screen.getByText("Sort By"));
    fireEvent.click(screen.getByText("Date Posted"));
    expect(onSortByNew).toHaveBeenCalled();
  });
});
