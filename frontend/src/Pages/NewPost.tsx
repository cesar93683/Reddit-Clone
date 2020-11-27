import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./EditPost";
import { useMutation } from "@apollo/client";
import { NEW_POST_MUTATION } from "../GraphQL/Mutation";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { Alert, Button, Form } from "react-bootstrap";

const NewPost = () => {
  const [newPost, { loading }] = useMutation(NEW_POST_MUTATION);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const history = useHistory();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  const postSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError("Please enter a title");
      return;
    }

    await newPost({ variables: { title, content } })
      .then(({ data }) => {
        history.push(`/posts/${data.createPost.id}`);
      })
      .catch((err) => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={postSubmitHandler}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={handleTitleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter content"
          value={content}
          onChange={handleContentChange}
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit">New Post</Button>
    </Form>
  );
};

export default NewPost;
