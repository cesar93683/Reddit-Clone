import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const NewPost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const postSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:5000/api/posts",
        "POST",
        JSON.stringify({
          title,
          description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="main-content Form">
      <div className="Form-Title">New Post</div>
      <form className="Form-Form" onSubmit={postSubmitHandler}>
        <label className="text-light" for="title">
          Title
        </label>
        <input
          className="Form-Input"
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
        />
        <label className="text-light" for="description">
          Description
        </label>
        <textarea
          className="Form-Input"
          type="text"
          id="description"
          value={description}
          onChange={handleDescriptionChange}
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
