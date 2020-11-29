import React from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../utils/auth-hook";

interface VoteSectionProps {
  numVotes: number;
  className?: string;
  onUpVote: () => void;
  onDownVote: () => void;
  currVote: number;
}

export default function VoteSection(props: VoteSectionProps) {
  const { numVotes, className, onUpVote, onDownVote, currVote } = props;
  const { userId } = useAuth();

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
