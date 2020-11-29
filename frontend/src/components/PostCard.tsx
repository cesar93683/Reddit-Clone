import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import IPost from "../utils/interfaces/IPost";
import timeSince from "../utils/timeSince";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "./CustomCardSubtitle";
import DeleteModalWithButton from "./DeleteModalWithButton";
import VoteSection from "./VoteSection";
import { gql, useMutation, useQuery } from "@apollo/client";
import LoadingSpinner from "./LoadingSpinner";
import { AuthContext } from "../utils/auth-context";

const POST_VOTE_QUERY = gql`
  query($postId: Int!) {
    postVote(postId: $postId) {
      value
    }
  }
`;

const VOTE_POST_MUTATION = gql`
  mutation($postId: Int!, $value: Int!) {
    votePost(postId: $postId, value: $value) {
      message
    }
  }
`;

interface CustomCardProps {
  post: IPost;
  currentDate: number;
  linkable?: boolean;
  onDelete?: (() => void) | null;
  className?: string;
}

export default function CustomCard(props: CustomCardProps) {
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
    currentDate,
    linkable,
    onDelete,
    className,
  } = props;

  const { isLoggedIn, userId } = useContext(AuthContext);

  const [numVotes, setNumVotes] = useState(numVotesFromProps);
  const [currVote, setCurrVote] = useState(0);

  const [votePost] = useMutation(VOTE_POST_MUTATION);
  const { data, loading: isVoteLoading } = useQuery(POST_VOTE_QUERY, {
    variables: { postId: Number(postId) },
    skip: !isLoggedIn,
  });

  useMemo(() => {
    setCurrVote(data && data.postVote ? data.postVote.value : 0);
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
          <LoadingSpinner />
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
          {content ? <Card.Text>{content}</Card.Text> : null}
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

            {onDelete && authorId === Number(userId) ? (
              <div>
                <Link className="mr-2" to={`/posts/${postId}/edit`}>
                  <Button variant="outline-primary">EDIT</Button>
                </Link>
                <DeleteModalWithButton type="post" onDelete={onDelete} />
              </div>
            ) : null}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
