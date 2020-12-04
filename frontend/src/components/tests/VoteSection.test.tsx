import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { AuthContext } from "../../utils/auth-context";
import VoteSection from "../VoteSection";

const onUpVote = jest.fn();
const onDownVote = jest.fn();

describe("<VoteSection />", () => {
  beforeEach(async () => {
    render(
      <AuthContext.Provider
        value={{
          userId: 1,
          token: "token",
          login: (userId: number, token: string) => {},
          logout: () => {},
        }}
      >
        <VoteSection
          numVotes={623}
          currVote={0}
          onDownVote={onDownVote}
          onUpVote={onUpVote}
        />
      </AuthContext.Provider>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  });
  test("onUpVote is called", () => {
    fireEvent.click(screen.getByText("^"));
    expect(onUpVote).toHaveBeenCalled();
  });
  test("onDownVote is called", () => {
    fireEvent.click(screen.getByText("v"));
    expect(onDownVote).toHaveBeenCalled();
  });
});
