import React, { useState } from "react";
import "./CommentForm.scss";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  enableSubmit: boolean;
}

const CommentForm = (props: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
        value={comment}
        onChange={handleChange}
      />
      <div className="d-flex justify-content-end">
        <button
          className={
            "btn btn-primary" + (props.enableSubmit ? "" : " btn-disabled")
          }
          type="submit"
          disabled={props.enableSubmit}
        >
          Comment
        </button>
      </div>
      {error && (
        <div className="d-flex justify-content-end text-danger">{error}</div>
      )}
    </form>
  );
};
export default CommentForm;
