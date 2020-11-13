import React from "react";

const Comment = (props) => {
  const { creatorUsername, creator, comment } = props;
  return (
    <div>
      <div>{creatorUsername}</div>
      <div>{creator}</div>
      <div>{comment}</div>
    </div>
  );
};
export default Comment;
