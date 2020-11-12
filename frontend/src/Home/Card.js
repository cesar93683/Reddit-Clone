import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

const Card = (props) => {
  return (
    <div className="Card">
      <div className="Card-LeftSideBar">
        <img alt="Up Vote" src="https://via.placeholder.com/16x16" />
        <div className="Card-Votes">{props.votes}</div>
        <img alt="Down Vote" src="https://via.placeholder.com/16x16" />
      </div>
      <div className="Card-RightSideBar">
        <div className="Card-Username">
          Posted by{" "}
          <Link className="Card-Username-Link" to="/">
            {props.username}
          </Link>
        </div>
        <div className="Card-Title">{props.title}</div>
        <Link to="/" className="Card-NumComments">
          {props.numComments} Comment{props.numComments === 1 ? "" : "s"}
        </Link>
      </div>
    </div>
  );
};

export default Card;
