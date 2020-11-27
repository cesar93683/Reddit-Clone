import React, { useState } from "react";
import timeSince from "../../../utils/timeSince";
import IComment from "../../../utils/interfaces/IComment";
import { DELETE_COMMENT_MUTATION } from "../../../GraphQL/Mutation";
import { useMutation } from "@apollo/client";
import { Card } from "react-bootstrap";
import CustomCardSubtitle from "../../../components/CustomCardSubtitle";
import DeleteModalWithButton from "../../../components/DeleteModalWithButton";

interface CommentProps {
  currentDate: number;
  comment: IComment;
  postId: number;
  userId: number;
  className: string;
}

const Comment = (props: CommentProps) => {
  const {
    comment: {
      id,
      author: { id: authorId, username },
      dateCreated,
      content,
    },
    currentDate,
    postId,
    userId,
    className,
  } = props;

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

  if (isCommentDeleted) {
    return <div className={className}>Comment deleted</div>;
  }

  return (
    <Card className={className}>
      <Card.Body>
        <CustomCardSubtitle
          authorId={authorId}
          timeSince={timeSince(currentDate, dateCreated)}
          username={username}
        />
        <Card.Text>{content}</Card.Text>
        {userId === authorId && (
          <div className="d-flex justify-content-end">
            <DeleteModalWithButton type="comment" onDelete={onDelete} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default Comment;
