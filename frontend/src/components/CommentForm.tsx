import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  enableSubmit?: boolean;
  buttonText?: string;
  defaultContent?: string;
}

export default function CommentForm(props: CommentFormProps) {
  const { onSubmit, enableSubmit, buttonText, defaultContent } = props;

  const [content, setContent] = useState(defaultContent ? defaultContent : "");
  const [error, setError] = useState("");

  const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const onSubmitClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content) {
      setError("Please Enter A Comment.");
      return;
    }
    setError("");
    onSubmit(content);
  };

  return (
    <Form onSubmit={onSubmitClick}>
      <Form.Control
        as="textarea"
        rows={3}
        value={content}
        onChange={onContentChange}
      />
      <div className="d-flex justify-content-end mt-1">
        <Button type="submit" disabled={enableSubmit}>
          {buttonText ? buttonText : "Comment"}
        </Button>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
    </Form>
  );
}
