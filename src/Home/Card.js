import React from "react";

const Card = (props) => {
  return (
    <div>
      <div>
        <div>Up</div>
        <div>{props.votes}</div>
        <div>Down</div>
      </div>
      <div>{props.title}</div>
      <div>{props.content}</div>
      <div>{props.username}</div>
    </div>
  );
};

export default Card;
