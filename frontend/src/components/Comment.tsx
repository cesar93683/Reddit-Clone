import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { AuthContext } from "../utils/auth-context";
import IComment from "../utils/interfaces/IComment";
import timeSince from "../utils/timeSince";
import CommentForm from "./CommentForm";
import CustomCardSubtitle from "./CustomCardSubtitle";
import DeleteModalWithButton from "./DeleteModalWithButton";
import VoteSection from "./VoteSection";

export const COMMENT_VOTE_QUERY = gql`
  query($commentId: Int!) {
    commentVote(commentId: $commentId) {
      value
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation($id: Int!, $postId: Int!) {
    deleteComment(id: $id, postId: $postId) {
      message
    }
  }
`;

export const EDIT_COMMENT_MUTATION = gql`
  mutation($id: Int!, $content: String!) {
    editComment(id: $id, content: $content) {
      id
    }
  }
`;

export const VOTE_COMMENT_MUTATION = gql`
  mutation($commentId: Int!, $value: Int!) {
    voteComment(commentId: $commentId, value: $value) {
      message
    }
  }
`;

interface CommentProps {
  comment: IComment;
  currentDate: number;
  postId: number;
  showVoteSection: boolean;
  className?: string;
}

export default function Comment(props: CommentProps) {
  const {
    comment: {
      id,
      author: { id: authorId, username },
      dateCreated,
      dateUpdated,
      content: contentFromProps,
      numVotes,
    },
    currentDate,
    postId,
    showVoteSection,
    className,
  } = props;

  const { userId } = useContext(AuthContext);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);
  const [editComment] = useMutation(EDIT_COMMENT_MUTATION);
  const [voteComment] = useMutation(VOTE_COMMENT_MUTATION);
  const [content, setContent] = useState(contentFromProps);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currVote, setCurrVote] = useState(0);

  const { data, loading: isVoteLoading } = useQuery(COMMENT_VOTE_QUERY, {
    variables: { commentId: id },
    skip: !userId,
  });

  useMemo(() => {
    if (data?.commentVote?.value) {
      setCurrVote(data.commentVote.value);
    }
  }, [data]);

  const onDelete = async () => {
    await deleteComment({ variables: { id, postId } })
      .then(({ data }) => {
        if (data.deleteComment.message === "Success") {
          setIsCommentDeleted(true);
        }
      })
      .catch(() => {});
  };

  const onEditClick = () => {
    setIsEditing(true);
  };

  const onCommentUpdate = async (newContent: string) => {
    await editComment({ variables: { id, content: newContent } })
      .then(() => {
        setContent(newContent);
        setIsEditing(false);
      })
      .catch(() => {});
  };

  const onDownVote = async () => {
    const value = currVote === -1 ? 0 : -1;
    await voteComment({ variables: { commentId: id, value } })
      .then(() => {
        setCurrVote(currVote === -1 ? 0 : -1);
      })
      .catch(() => {});
  };

  const onUpVote = async () => {
    const value = currVote === 1 ? 0 : 1;
    await voteComment({ variables: { commentId: id, value } })
      .then(() => {
        setCurrVote(currVote === 1 ? 0 : 1);
      })
      .catch(() => {});
  };

  if (isCommentDeleted) {
    return <div className={className}>Comment deleted</div>;
  }

  return (
    <Card className={className}>
      <Card.Body className="p-2 d-flex">
        {showVoteSection ? (
          <VoteSection
            numVotes={numVotes}
            className="mr-2"
            onUpVote={onUpVote}
            onDownVote={onDownVote}
            currVote={currVote}
            isVoteLoading={isVoteLoading}
          />
        ) : null}
        <div className="w-100">
          <CustomCardSubtitle
            authorId={authorId}
            timeSinceDateCreated={timeSince(currentDate, dateCreated)}
            timeSinceDateUpdated={timeSince(currentDate, dateUpdated)}
            username={username}
          />
          {isEditing ? (
            <CommentForm
              onSubmit={onCommentUpdate}
              buttonText="Update"
              defaultContent={content}
            />
          ) : null}
          {!isEditing ? <Card.Text>{content}</Card.Text> : null}
          {!isEditing && userId === authorId ? (
            <div className="d-flex justify-content-end">
              <Button
                onClick={onEditClick}
                className="mr-2"
                variant="outline-primary"
              >
                Edit
              </Button>
              <DeleteModalWithButton type="comment" onDelete={onDelete} />
            </div>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}
