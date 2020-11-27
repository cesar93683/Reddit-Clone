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
  const { numVotes: numVotesFromProps, postId, className } = props;

  const [numVotes, setNumVotes] = useState(numVotesFromProps);
  const [currVote, setCurrVote] = useState(0);

  const [votePost] = useMutation(VOTE_POST_MUTATION);
  const { data, loading } = useQuery(GET_VOTE_QUERY, {
    variables: { postId: Number(postId) },
  });

  useMemo(() => {
    setCurrVote(
      data && data.getVote && data.getVote.value ? data.getVote.value : 0
    );
  }, [data]);

  const downVote = () => {
    if (currVote === 1) {
      setNumVotes(numVotes - 2);
    } else if (currVote === -1) {
      setNumVotes(numVotes + 1);
    } else {
      setNumVotes(numVotes - 1);
    }
    setCurrVote(currVote === -1 ? 0 : -1);
  };

  const upVote = () => {
    if (currVote === 1) {
      setNumVotes(numVotes - 1);
    } else if (currVote === -1) {
      setNumVotes(numVotes + 2);
    } else {
      setNumVotes(numVotes + 1);
    }
    setCurrVote(currVote === 1 ? 0 : 1);
  };

  const handleDownVote = async () => {
    let value = currVote === -1 ? 0 : -1;
    await votePost({ variables: { postId, value } })
      .then(({ data }) => {
        downVote();
      })
      .catch((err) => {});
  };

  const handleUpVote = async () => {
    let value = currVote === 1 ? 0 : 1;
    await votePost({ variables: { postId, value } })
      .then(({ data }) => {
        upVote();
      })
      .catch((err) => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={"d-flex flex-column align-items-center " + className}>
      <Button
        onClick={handleUpVote}
        variant={currVote === 1 ? "primary" : "secondary"}
        disabled={!(data && data.getVote)}
        size="sm"
      >
        ^
      </Button>
      <div>{numVotes}</div>
      <Button
        onClick={handleDownVote}
        variant={currVote === -1 ? "primary" : "secondary"}
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
