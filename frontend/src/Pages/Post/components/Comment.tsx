import React, { useState } from "react";
import timeSince from "../../../utils/timeSince";
import IComment from "../../../utils/interfaces/IComment";
import {
  DELETE_COMMENT_MUTATION,
  EDIT_COMMENT_MUTATION,
} from "../../../GraphQL/Mutation";
import { useMutation } from "@apollo/client";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "../../../components/CustomCardSubtitle";
import DeleteModalWithButton from "../../../components/DeleteModalWithButton";
import CommentForm from "./CommentForm";

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

  if (isCommentDeleted) {
    return <div className={className}>Comment deleted</div>;
  }

  return (
    <Card className={className}>
      <Card.Body>
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
      </Card.Body>
    </Card>
  );
};
export default Comment;
