import React from "react";
import "./Comment.scss";
import { Link } from "react-router-dom";
import timeSince from "../../utils/timeSince";
import IComment from "../../shared/interfaces/IComment";

interface CommentProps {
  currentDate: number;
  comment: IComment;
}

const Comment = (props: CommentProps) => {
  const {
    comment: { creatorUsername, creator, dateCreated, comment },
    currentDate,
  } = props;

  return (
    <div className="mb-3">
      <div className="d-flex">
        <Link className="Comment__Username" to={"/users/" + creator}>
          {creatorUsername}
        </Link>
        <div className="text-light ml-1">
          {timeSince(currentDate, dateCreated)}
        </div>
      </div>
      <div className="text-light">{comment}</div>
    </div>
  );
};
export default Comment;
