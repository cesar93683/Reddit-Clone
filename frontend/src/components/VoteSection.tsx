import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../utils/auth-context";

interface VoteSectionProps {
  numVotes: number;
  className?: string;
  handleUpVote: () => void;
  handleDownVote: () => void;
  currVote: number;
}

const VoteSection = (props: VoteSectionProps) => {
  const { numVotes, className, handleUpVote, handleDownVote, currVote } = props;
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className={"d-flex flex-column align-items-center " + className}>
      <Button
        onClick={handleUpVote}
        variant={currVote === 1 ? "primary" : "secondary"}
        disabled={!isLoggedIn}
        size="sm"
      >
        ^
      </Button>
      <div>{numVotes}</div>
      <Button
        onClick={handleDownVote}
        variant={currVote === -1 ? "primary" : "secondary"}
        disabled={!isLoggedIn}
        size="sm"
        className="w-100"
      >
        v
      </Button>
    </div>
  );
};
export default VoteSection;
