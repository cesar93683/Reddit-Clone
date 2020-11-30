import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const POST_QUERY = gql`
  query($id: Int!) {
    post(id: $id) {
      title
      content
    }
  }
`;

const EDIT_POST_MUTATION = gql`
  mutation($id: Int!, $content: String!) {
    editPost(id: $id, content: $content) {
      id
    }
  }
`;

interface PostParams {
  id: string;
}

export default function EditPost() {
  const id = Number(useParams<PostParams>().id);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [editPost] = useMutation(EDIT_POST_MUTATION);

  const { loading, data, error } = useQuery(POST_QUERY, {
    variables: { id },
  });

  useMemo(() => {
    if (data?.post) {
      setContent(data.post.content);
      setTitle(data.post.title);
    }
  }, [data]);

  const onSubmitPostUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await editPost({ variables: { id, content } })
      .then(() => {
        history.push("/post/" + id);
      })
      .catch(() => {});
  };

  const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !title) {
    return <h1>An error occured.</h1>;
  }

  return (
    <Form onSubmit={onSubmitPostUpdate}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control disabled type="text" value={title} />
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
      <Button type="submit">Update Post</Button>
    </Form>
  );
}
