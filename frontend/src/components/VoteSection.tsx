import { useMutation, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { VOTE_POST_MUTATION } from "../GraphQL/Mutation";
import { GET_VOTE_QUERY } from "../GraphQL/Query";

interface VoteSectionProps {
  numVotes: number;
  postId: string;
}

const VoteSection = (props: VoteSectionProps) => {
  const { numVotes, postId } = props;

  const [votePost] = useMutation(VOTE_POST_MUTATION);
  const { data } = useQuery(GET_VOTE_QUERY, {
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
