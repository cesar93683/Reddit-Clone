import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  enableSubmit?: boolean;
  buttonText?: string;
  defaultValue?: string;
}

const CommentForm = (props: CommentFormProps) => {
  const { onSubmit, enableSubmit, buttonText, defaultValue } = props;

  const [content, setContent] = useState(defaultValue ? defaultValue : "");
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
    onSubmit(content);
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
        <Button type="submit" disabled={enableSubmit}>
          {buttonText ? buttonText : "Comment"}
        </Button>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
    </Form>
  );
};
export default CommentForm;
