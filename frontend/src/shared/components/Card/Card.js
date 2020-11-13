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

  const content = (
    <React.Fragment>
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
        <div className="Card-Title">{title}</div>
        <div className="Card-Description">{description}</div>
        <div className="Card-BottomBar">
          <div className="Card-NumComments">
            {numComments} Comment
            {parseInt(numComments) === 1 ? "" : "s"}
          </div>

          {userId === creator && (
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
    </React.Fragment>
  );
  return linkable ? (
    <Link to={"/posts/" + postId} className="Card Card__Linkable">
      {content}
    </Link>
  ) : (
    <div className="Card">{content}</div>
  );
};

export default Card;
