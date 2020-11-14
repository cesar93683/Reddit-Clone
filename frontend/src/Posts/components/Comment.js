import React from "react";
import "./Comment.scss";
import { Link } from "react-router-dom";

const Comment = (props) => {
  const { creatorUsername, creator, comment, dateCreated } = props;
  return (
    <div className="Comment">
      <div className="d-flex">
        <Link className="Comment__Username" to={"/users/" + creator}>
          {creatorUsername}
        </Link>
        <div className="text-light ml-1">{dateCreated}</div>
      </div>
      <div className="text-light">{comment}</div>
    </div>
  );
};
export default Comment;
