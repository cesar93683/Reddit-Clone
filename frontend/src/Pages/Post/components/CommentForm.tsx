import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

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
    <Form onSubmit={handleSubmit}>
      <Form.Control
        as="textarea"
        rows={3}
        value={comment}
        onChange={handleChange}
      />
      <div className="d-flex justify-content-end mt-1">
        <Button type="submit" disabled={props.enableSubmit}>
          Comment
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </Form>
  );
};
export default CommentForm;
