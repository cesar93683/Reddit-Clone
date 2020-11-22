import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./EditPost";
import { gql, useMutation } from "@apollo/client";

const NEW_POST_MUTATION = gql`
  mutation($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
    }
  }
`;

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
    await newPost({ variables: { title, content } })
      .then(({ data }) => {})
      .catch((err) => {});
    history.push("/");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="Form">
      <div className="Form__Title">New Post</div>
      <form className="Form__Form" onSubmit={postSubmitHandler}>
        <label className="text-light" htmlFor="title">
          Title
        </label>
        <input
          className="Form__Input"
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
        />
        <label className="text-light" htmlFor="content">
          Content
        </label>
        <textarea
          className="Form__TextArea"
          id="content"
          value={content}
          onChange={handleContentChange}
        />
        {error && <div className="Form-Error">{error}</div>}
        <button className="btn btn-primary" type="submit">
          New Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
