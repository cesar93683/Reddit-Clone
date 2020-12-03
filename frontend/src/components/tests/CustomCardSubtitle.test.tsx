import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import CustomCardSubtitle from "../CustomCardSubtitle";

test("should show two different dates if they are different", async () => {
  act(() => {
    render(
      <Router>
        <CustomCardSubtitle
          authorId={1}
          username={"username"}
          timeSinceDateCreated={"123456"}
          timeSinceDateUpdated={"654321"}
        />
      </Router>
    );
  });
  expect(screen.getByText("123456")).toBeInTheDocument();
  expect(screen.getByText("edited 654321")).toBeInTheDocument();
});
