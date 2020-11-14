import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

const Card = (props) => {
  const {
    postId,
    numComments,
    creatorUsername,
    title,
    creator,
    userId,
    description,
    dateCreated,
    linkable,
    onDelete,
  } = props;

  return (
    <div className={"Card" + (linkable ? " Card__Linkable" : "")}>
      <div className="d-flex justify-content-between">
        <div className="Card-Username">
          {"Posted by "}
          <Link className="Card-Username-Link" to={"/users/" + creator}>
            {creatorUsername}
          </Link>
        </div>
        <div className="text-light">{dateCreated}</div>
      </div>
      {linkable ? (
        <Link className="Card-Title" to={"/posts/" + postId}>
          {title}
        </Link>
      ) : (
        <div className="Card-Title">{title}</div>
      )}
      <div className="Card-Description">{description}</div>
      <div className="d-flex justify-content-between">
        {linkable ? (
          <Link className="Card-NumComments" to={"/posts/" + postId}>
            {numComments} Comment
            {parseInt(numComments) === 1 ? "" : "s"}
          </Link>
        ) : (
          <div className="Card-NumComments">
            {numComments} Comment
            {parseInt(numComments) === 1 ? "" : "s"}
          </div>
        )}

        {onDelete && userId === creator && (
          <div>
            <Link className="btn btn-primary" to={`/posts/${postId}/edit`}>
              EDIT
            </Link>
            <button
              onClick={onDelete}
              className="btn btn-danger Card__DeleteButton"
            >
              DELETE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
