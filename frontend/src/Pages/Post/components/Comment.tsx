import React, { useState } from "react";
import timeSince from "../../../utils/timeSince";
import IComment from "../../../utils/interfaces/IComment";
import { DELETE_COMMENT_MUTATION } from "../../../GraphQL/Mutation";
import { useMutation } from "@apollo/client";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "../../../components/CustomCardSubtitle";

interface CommentProps {
  currentDate: number;
  comment: IComment;
  postId: number;
  userId: number;
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
    return <div className="my-2">Comment deleted</div>;
  }

  return (
    <Card className="my-2">
      <Card.Body>
        <CustomCardSubtitle
          authorId={authorId}
          timeSince={timeSince(currentDate, dateCreated)}
          username={username}
        />
        <Card.Text>{content}</Card.Text>
        {userId === authorId && (
          <div className="d-flex justify-content-end">
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default Comment;
