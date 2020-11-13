import React, { useState } from "react";

const CommentForm = (props) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!comment) {
      setError("Please Enter A Comment.");
      return;
    }
    setError("");
    props.onSubmit(comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={comment} onChange={handleChange} />
      <input type="submit" />
      {error && <div>{error}</div>}
    </form>
  );
};
export default CommentForm;
