import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { VOTE_POST_MUTATION } from "../GraphQL/Mutation";

interface VoteSectionProps {
  numVotes: number;
  postId: string;
}

const VoteSection = (props: VoteSectionProps) => {
  const { numVotes, postId } = props;

  const [upVoteActive, setUpVoteActive] = useState(false);
  const [downVoteActive, setDownVoteActive] = useState(false);

  const [votePost] = useMutation(VOTE_POST_MUTATION);

  const handleDownVote = async () => {
    let value = downVoteActive ? 0 : -1;
    await votePost({ variables: { postId, value } })
      .then(({ data }) => {})
      .catch((err) => {});
    setDownVoteActive(!downVoteActive);
  };

  const handleUpVote = async () => {
    let value = upVoteActive ? 0 : 1;
    await votePost({ variables: { postId, value } })
      .then(({ data }) => {})
      .catch((err) => {});
    setUpVoteActive(!upVoteActive);
  };

  return (
    <div>
      <Button
        onClick={handleUpVote}
        variant={upVoteActive ? "primary" : "secondary"}
      >
        up
      </Button>
      <div>{numVotes}</div>
      <Button
        onClick={handleDownVote}
        variant={downVoteActive ? "primary" : "secondary"}
      >
        down
      </Button>
    </div>
  );
};
export default VoteSection;
