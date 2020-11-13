import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

const Card = (props) => {
  const {
    postId,
    votes,
    numComments,
    creatorUsername,
    title,
    creator,
    userId,
    description,
    linkable,
    onDelete,
  } = props;

  return (
    <div className={"Card" + (linkable ? " Card__Linkable" : "")}>
      <div className="Card-LeftSideBar">
        <img alt="Up Vote" src="https://via.placeholder.com/16x16" />
        <div className="Card-Votes">{votes}</div>
        <img alt="Down Vote" src="https://via.placeholder.com/16x16" />
      </div>
      <div className="Card-RightSideBar">
        <div className="Card-Username">
          Posted by{" "}
          <Link className="Card-Username-Link" to="/">
            {creatorUsername}
          </Link>
        </div>
        {linkable ? (
          <Link className="Card-Title" to={"/posts/" + postId}>
            {title}
          </Link>
        ) : (
          <div className="Card-Title">{title}</div>
        )}
        <div className="Card-Description">{description}</div>
        <div className="Card-BottomBar">
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
            <div className="Card-ModifyButtons">
              <Link className="Card-EditButton" to={`/post/${postId}/edit`}>
                EDIT
              </Link>
              <div onClick={onDelete} className="Card-DeleteButton">
                DELETE
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
