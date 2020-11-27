import React, { useMemo, useState } from "react";
import timeSince from "../../../utils/timeSince";
import IComment from "../../../utils/interfaces/IComment";
import {
  DELETE_COMMENT_MUTATION,
  EDIT_COMMENT_MUTATION,
  VOTE_COMMENT_MUTATION,
} from "../../../GraphQL/Mutation";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "../../../components/CustomCardSubtitle";
import DeleteModalWithButton from "../../../components/DeleteModalWithButton";
import CommentForm from "./CommentForm";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { COMMENT_VOTE_QUERY } from "../../../GraphQL/Query";
import VoteSection from "../../../components/VoteSection";

interface CommentProps {
  currentDate: number;
  comment: IComment;
  postId: number;
  userId: number;
  className: string;
}

const Comment = (props: CommentProps) => {
  let {
    comment: {
      id,
      author: { id: authorId, username },
      dateCreated,
      dateUpdated,
      content: contentFromProps,
      numVotes: numVotesFromProps,
    },
    currentDate,
    postId,
    userId,
    className,
  } = props;

  const [content, setContent] = useState(contentFromProps);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

  const onDelete = async () => {
    await deleteComment({ variables: { id, postId } })
      .then(({ data }) => {
        if (data.deleteComment.message === "Success") {
          setIsCommentDeleted(true);
        }
      })
      .catch((err) => {});
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editComment] = useMutation(EDIT_COMMENT_MUTATION);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdateComment = async (newContent: string) => {
    await editComment({ variables: { id, content: newContent } })
      .then(({ data }) => {
        console.log(data);
        setContent(newContent);
        setIsEditing(false);
      })
      .catch((err) => {});
  };

  const [numVotes, setNumVotes] = useState(numVotesFromProps);
  const [currVote, setCurrVote] = useState(0);

  const [voteComment] = useMutation(VOTE_COMMENT_MUTATION);
  const { data, loading: isVoteLoading } = useQuery(COMMENT_VOTE_QUERY, {
    variables: { commentId: Number(id) },
  });

  useMemo(() => {
    setCurrVote(
      data && data.commentVote && data.commentVote.value
        ? data.commentVote.value
        : 0
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
    await voteComment({ variables: { commentId: id, value } })
      .then(() => {
        downVote();
      })
      .catch((err) => {});
  };

  const onUpVote = async () => {
    let value = currVote === 1 ? 0 : 1;
    await voteComment({ variables: { commentId: id, value } })
      .then(() => {
        upVote();
      })
      .catch((err) => {});
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

  if (isCommentDeleted) {
    return <div className={className}>Comment deleted</div>;
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
          {isEditing && (
            <CommentForm
              onSubmit={handleUpdateComment}
              buttonText="Update"
              defaultValue={content}
            />
          )}
          {!isEditing && <Card.Text>{content}</Card.Text>}
          {!isEditing && userId === authorId && (
            <div className="d-flex justify-content-end">
              <Button
                onClick={handleEdit}
                className="mr-2"
                variant="outline-primary"
              >
                Edit
              </Button>
              <DeleteModalWithButton type="comment" onDelete={onDelete} />
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
export default Comment;
