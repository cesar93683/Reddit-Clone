import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import IPost from "../utils/interfaces/IPost";
import timeSince from "../utils/timeSince";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "./CustomCardSubtitle";
import DeleteModalWithButton from "./DeleteModalWithButton";
import VoteSection from "./VoteSection";
import { useMutation, useQuery } from "@apollo/client";
import { POST_VOTE_QUERY } from "../GraphQL/Query";
import { VOTE_POST_MUTATION } from "../GraphQL/Mutation";
import LoadingSpinner from "./LoadingSpinner";

interface CustomCardProps {
  post: IPost;
  currentDate: number;
  userId?: number | null;
  linkable?: boolean;
  onDelete?: (() => void) | null;
  className?: string;
}

const CustomCard = (props: CustomCardProps) => {
  const {
    post: {
      id: postId,
      title,
      content,
      author: { id: authorId, username },
      numComments,
      numVotes: numVotesFromProps,
      dateCreated,
      dateUpdated,
    },
    userId,
    currentDate,
    linkable,
    onDelete,
    className,
  } = props;

  const [numVotes, setNumVotes] = useState(numVotesFromProps);
  const [currVote, setCurrVote] = useState(0);

  const [votePost] = useMutation(VOTE_POST_MUTATION);
  const { data, loading: isVoteLoading } = useQuery(POST_VOTE_QUERY, {
    variables: { postId: Number(postId) },
  });

  useMemo(() => {
    setCurrVote(
      data && data.postVote && data.postVote.value ? data.postVote.value : 0
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

  const onDownVote = async () => {
    let value = currVote === -1 ? 0 : -1;
    await votePost({ variables: { postId, value } })
      .then(() => {
        downVote();
      })
      .catch(() => {});
  };

  const onUpVote = async () => {
    let value = currVote === 1 ? 0 : 1;
    await votePost({ variables: { postId, value } })
      .then(() => {
        upVote();
      })
      .catch(() => {});
  };

  if (isVoteLoading) {
    return (
      <Card className={className}>
        <Card.Body className="d-flex">
          <LoadingSpinner />;
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Body className="d-flex">
        <VoteSection
          numVotes={numVotes}
          className="mr-2"
          onUpVote={onUpVote}
          onDownVote={onDownVote}
          currVote={currVote}
        />
        <div className="w-100">
          <CustomCardSubtitle
            authorId={authorId}
            timeSinceDateCreated={timeSince(currentDate, dateCreated)}
            timeSinceDateUpdated={timeSince(currentDate, dateUpdated)}
            username={username}
          />
          <Card.Title>
            {linkable ? (
              <Link className="text-body" to={"/posts/" + postId}>
                {title}
              </Link>
            ) : (
              <div>{title}</div>
            )}
          </Card.Title>
          {content && <Card.Text>{content}</Card.Text>}
          <div className="d-flex justify-content-between align-items-center">
            {linkable ? (
              <Link className="text-body" to={"/posts/" + postId}>
                {numComments} Comment
                {numComments === 1 ? "" : "s"}
              </Link>
            ) : (
              <div>
                {numComments} Comment
                {numComments === 1 ? "" : "s"}
              </div>
            )}

            {onDelete && authorId === userId && (
              <div>
                <Link className="mr-2" to={`/posts/${postId}/edit`}>
                  <Button variant="outline-primary">EDIT</Button>
                </Link>
                <DeleteModalWithButton type="post" onDelete={onDelete} />
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
