import React from "react";

const Comment = (props) => {
  const { votes, creatorUsername, creator, comment } = props;
  return (
    <div>
      <div>{votes}</div>
      <div>{creatorUsername}</div>
      <div>{creator}</div>
      <div>{comment}</div>
    </div>
  );
};
export default Comment;
