import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import SortDropDown from "../SortDropDown";

const sortByVotes = jest.fn();
const sortByNew = jest.fn();

describe("<SortDropDown />", () => {
  beforeEach(() => {
    act(() => {
      render(
        <SortDropDown
          sortByVotes={sortByVotes}
          topActive={false}
          sortByNew={sortByNew}
          newActive
        />
      );
    });
  });
  test("should call sortByVotes", async () => {
    act(() => {
      fireEvent.click(screen.getByText("Sort By"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    act(() => {
      fireEvent.click(screen.getByText("Top"));
    });
    expect(sortByVotes).toHaveBeenCalled();
  });
  test("should call sortByNew", async () => {
    act(() => {
      fireEvent.click(screen.getByText("Sort By"));
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    act(() => {
      fireEvent.click(screen.getByText("New"));
    });
    expect(sortByNew).toHaveBeenCalled();
  });
});
