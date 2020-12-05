import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../utils/auth-context";
import LoadingSpinner from "./LoadingSpinner";

interface VoteSectionProps {
  numVotes: number;
  className?: string;
  onUpVote: () => void;
  onDownVote: () => void;
  currVote: number;
  isVoteLoading?: boolean;
}

export default function VoteSection(props: VoteSectionProps) {
  const {
    numVotes,
    className,
    onUpVote,
    onDownVote,
    currVote,
    isVoteLoading,
  } = props;
  const { userId } = useContext(AuthContext);

  if (isVoteLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={"d-flex flex-column align-items-center " + className}>
      <Button
        onClick={onUpVote}
        variant={currVote === 1 ? "primary" : "secondary"}
        disabled={!userId}
        size="sm"
      >
        ^
      </Button>
      <div>{numVotes}</div>
      <Button
        onClick={onDownVote}
        variant={currVote === -1 ? "primary" : "secondary"}
        disabled={!userId}
        size="sm"
        className="w-100"
      >
        v
      </Button>
    </div>
  );
}
