import React, { useContext, useState } from "react";
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
    numVotes: numVotesFromProps,
    className,
    onUpVote,
    onDownVote,
    currVote,
    isVoteLoading,
  } = props;
  const { userId } = useContext(AuthContext);
  const [numVotes, setNumVotes] = useState(numVotesFromProps);

  if (isVoteLoading) {
    return <LoadingSpinner />;
  }

  const onDownVoteClick = () => {
    if (currVote === 1) {
      setNumVotes(numVotes - 2);
    } else if (currVote === -1) {
      setNumVotes(numVotes + 1);
    } else {
      setNumVotes(numVotes - 1);
    }
    onDownVote();
  };

  const onUpVoteClick = () => {
    if (currVote === 1) {
      setNumVotes(numVotes - 1);
    } else if (currVote === -1) {
      setNumVotes(numVotes + 2);
    } else {
      setNumVotes(numVotes + 1);
    }
    onUpVote();
  };

  return (
    <div className={"d-flex flex-column align-items-center " + className}>
      <Button
        onClick={onUpVoteClick}
        variant={currVote === 1 ? "primary" : "secondary"}
        disabled={!userId}
        size="sm"
      >
        ^
      </Button>
      <div>{numVotes}</div>
      <Button
        onClick={onDownVoteClick}
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
