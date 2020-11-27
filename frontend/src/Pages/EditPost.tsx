import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { EDIT_POST_MUTATION } from "../GraphQL/Mutation";
import { GET_POST_BY_ID_QUERY } from "../GraphQL/Query";

interface PostParams {
  postId: string;
}

const EditPost = () => {
  const postId = useParams<PostParams>().postId;
  const history = useHistory();
  const [content, setContent] = useState("");
  const [editPost] = useMutation(EDIT_POST_MUTATION);

  const { loading, data, error } = useQuery(GET_POST_BY_ID_QUERY, {
    variables: { id: Number(postId) },
  });

  useEffect(() => {
    if (!loading && data) {
      setContent(data.getPostById.content);
    }
  }, [loading, data]);

  const postUpdateSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await editPost({ variables: { id: Number(postId), content } })
      .then(({ data }) => {
        history.push("/posts/" + postId);
      })
      .catch((err) => {});
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={postUpdateSubmitHandler}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control disabled type="text" value={data.getPostById.title} />
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
      <Button type="submit">Update Post</Button>
    </Form>
  );
};
export default EditPost;
