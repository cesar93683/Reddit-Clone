import { useMutation, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { VOTE_POST_MUTATION } from "../GraphQL/Mutation";
import { GET_VOTE_QUERY } from "../GraphQL/Query";
import LoadingSpinner from "./LoadingSpinner";

interface VoteSectionProps {
  numVotes: number;
  postId: string;
  className?: string;
}

const VoteSection = (props: VoteSectionProps) => {
  const { numVotes, postId, className } = props;

  const [votePost] = useMutation(VOTE_POST_MUTATION);
  const { data, loading } = useQuery(GET_VOTE_QUERY, {
    variables: { postId: Number(postId) },
  });

  const [upVoteActive, setUpVoteActive] = useState(false);
  const [downVoteActive, setDownVoteActive] = useState(false);

  useMemo(() => {
    setUpVoteActive(data && data.getVote && data.getVote.value === 1);
    setDownVoteActive(data && data.getVote && data.getVote.value === -1);
  }, [data]);

  const handleDownVote = async () => {
    let value = downVoteActive ? 0 : -1;
    await votePost({ variables: { postId, value } })
      .then(({ data }) => {})
      .catch((err) => {});
    setDownVoteActive(!downVoteActive);
    setUpVoteActive(false);
  };

  const handleUpVote = async () => {
    let value = upVoteActive ? 0 : 1;
    await votePost({ variables: { postId, value } })
      .then(({ data }) => {})
      .catch((err) => {});
    setUpVoteActive(!upVoteActive);
    setDownVoteActive(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={"d-flex flex-column align-items-center " + className}>
      <Button
        onClick={handleUpVote}
        variant={upVoteActive ? "primary" : "secondary"}
        disabled={!(data && data.getVote)}
        size="sm"
      >
        ^
      </Button>
      <div>{numVotes}</div>
      <Button
        onClick={handleDownVote}
        variant={downVoteActive ? "primary" : "secondary"}
        disabled={!(data && data.getVote)}
        size="sm"
        className="w-100"
      >
        v
      </Button>
    </div>
  );
};
export default VoteSection;
