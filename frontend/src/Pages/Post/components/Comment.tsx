import React, { useState } from "react";
import "./Comment.scss";
import { Link } from "react-router-dom";
import timeSince from "../../../utils/timeSince";
import IComment from "../../../utils/interfaces/IComment";
import { DELETE_COMMENT_MUTATION } from "../../../GraphQL/Mutation";
import { useMutation } from "@apollo/client";

interface CommentProps {
  currentDate: number;
  comment: IComment;
  postId: number;
  userId: string;
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
    return <div className="mb-3 text-light">Comment deleted</div>;
  }

  return (
    <div className="mb-3">
      <div className="d-flex">
        <Link className="Comment__Username" to={"/users/" + authorId}>
          {username}
        </Link>
        <div className="text-light ml-1">
          {timeSince(currentDate, dateCreated)}
        </div>
        {Number(userId) === authorId && (
          <button onClick={onDelete} className="btn btn-danger">
            Delete
          </button>
        )}
      </div>
      <div className="text-light">{content}</div>
    </div>
  );
};
export default Comment;
