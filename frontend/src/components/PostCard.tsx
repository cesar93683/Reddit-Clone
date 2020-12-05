import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/auth-context";
import IPost from "../utils/interfaces/IPost";
import timeSince from "../utils/timeSince";
import CustomCardSubtitle from "./CustomCardSubtitle";
import DeleteModalWithButton from "./DeleteModalWithButton";
import VoteSection from "./VoteSection";

export const POST_VOTE_QUERY = gql`
  query($postId: Int!) {
    postVote(postId: $postId) {
      value
    }
  }
`;

export const VOTE_POST_MUTATION = gql`
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
      numVotes,
      dateCreated,
      dateUpdated,
    },
    currentDate,
    linkable,
    onDelete,
    className,
  } = props;

  const { userId } = useContext(AuthContext);

  const [currVote, setCurrVote] = useState(0);

  const [votePost] = useMutation(VOTE_POST_MUTATION);
  const { data, loading: isVoteLoading } = useQuery(POST_VOTE_QUERY, {
    variables: { postId },
    skip: !userId,
  });

  useMemo(() => {
    if (data?.postVote?.value) {
      setCurrVote(data.postVote.value);
    }
  }, [data]);

  const onDownVote = async () => {
    const value = currVote === -1 ? 0 : -1;
    await votePost({ variables: { postId, value } })
      .then(() => {
        setCurrVote(currVote === -1 ? 0 : -1);
      })
      .catch(() => {});
  };

  const onUpVote = async () => {
    const value = currVote === 1 ? 0 : 1;
    await votePost({ variables: { postId, value } })
      .then(() => {
        setCurrVote(currVote === 1 ? 0 : 1);
      })
      .catch(() => {});
  };

  return (
    <Card className={className}>
      <Card.Body className="d-flex">
        <VoteSection
          numVotes={numVotes}
          className="mr-2"
          onUpVote={onUpVote}
          onDownVote={onDownVote}
          currVote={currVote}
          isVoteLoading={isVoteLoading}
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
              <Link className="text-body" to={"/post/" + postId}>
                {title}
              </Link>
            ) : (
              <div>{title}</div>
            )}
          </Card.Title>
          {content ? <Card.Text>{content}</Card.Text> : null}
          <div className="d-flex justify-content-between align-items-center">
            {linkable ? (
              <Link className="text-body" to={"/post/" + postId}>
                {numComments} Comment
                {numComments === 1 ? "" : "s"}
              </Link>
            ) : (
              <div>
                {numComments} Comment
                {numComments === 1 ? "" : "s"}
              </div>
            )}

            {onDelete && authorId === userId ? (
              <div>
                <Link className="mr-2" to={`/post/${postId}/edit`}>
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
