import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  enableSubmit: boolean;
}

const CommentForm = (props: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content) {
      setError("Please Enter A Comment.");
      return;
    }
    setError("");
    props.onSubmit(content);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Control
        as="textarea"
        rows={3}
        value={content}
        onChange={handleContentChange}
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
