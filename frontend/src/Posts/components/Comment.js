import React from "react";
import "./Comment.css";
import { Link } from "react-router-dom";

const Comment = (props) => {
  const { creatorUsername, creator, comment } = props;
  return (
    <div className="Comment">
      <Link className="Comment__Username" to={"/users/" + creator}>
        {creatorUsername}
      </Link>
      <div className="Comment__Comment">{comment}</div>
    </div>
  );
};
export default Comment;
