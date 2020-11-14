import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";
import timeSince from "../../../utils/timeSince";

const Card = (props) => {
  const {
    postId,
    numComments,
    creatorUsername,
    title,
    creator,
    userId,
    description,
    currentDate,
    dateCreated,
    linkable,
    onDelete,
  } = props;

  return (
    <div className={"Card" + (linkable ? " Card__Linkable" : "")}>
      <div className="d-flex justify-content-between">
        <div className="text-light-gray mb-2">
          {"Posted by "}
          <Link className="Card__Username__Link" to={"/users/" + creator}>
            {creatorUsername}
          </Link>
        </div>
        <div className="text-light">{timeSince(currentDate, dateCreated)}</div>
      </div>
      {linkable ? (
        <Link className="Card__Title" to={"/posts/" + postId}>
          {title}
        </Link>
      ) : (
        <div className="Card__Title">{title}</div>
      )}
      <div className="text-light mb-2">{description}</div>
      <div className="d-flex justify-content-between">
        {linkable ? (
          <Link className="Card__NumComments" to={"/posts/" + postId}>
            {numComments} Comment
            {parseInt(numComments) === 1 ? "" : "s"}
          </Link>
        ) : (
          <div className="Card__NumComments">
            {numComments} Comment
            {parseInt(numComments) === 1 ? "" : "s"}
          </div>
        )}

        {onDelete && userId === creator && (
          <div>
            <Link className="btn btn-primary" to={`/posts/${postId}/edit`}>
              EDIT
            </Link>
            <button onClick={onDelete} className="btn btn-danger ml-2">
              DELETE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
