import React, { useState } from "react";
import "./CommentForm.scss";

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
      <textarea
        className="CommentForm__TextArea"
        type="text"
        value={comment}
        onChange={handleChange}
      />
      <div className="CommentForm__Submit">
        <input type="submit" value="Comment" />
      </div>
      {error && <div>{error}</div>}
    </form>
  );
};
export default CommentForm;
