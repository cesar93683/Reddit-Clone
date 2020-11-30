import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import "./EditPost";

const NEW_POST_MUTATION = gql`
  mutation($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
    }
  }
`;

export default function NewPost() {
  const [newPost, { loading }] = useMutation(NEW_POST_MUTATION);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const history = useHistory();

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };
  const onPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError("Please enter a title");
      return;
    }

    await newPost({ variables: { title, content } })
      .then(({ data }) => {
        history.push(`/post/${data.createPost.id}`);
      })
      .catch(() => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={onPostSubmit}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={onTitleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter content"
          value={content}
          onChange={onContentChange}
        />
      </Form.Group>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <Button type="submit">New Post</Button>
    </Form>
  );
}
