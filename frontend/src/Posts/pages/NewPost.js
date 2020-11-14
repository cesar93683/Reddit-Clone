import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./NewPost.css";

const NewPost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };
  const placeSubmitHandler = async (event) => {
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
    <div className="NewPost Form">
      <div className="Form-Title">New Post</div>
      <form className="Form-Form" onSubmit={placeSubmitHandler}>
        <label className="text-light" for="title">
          Title
        </label>
        <input
          className="Form-Input"
          type="text"
          id="title"
          value={title}
          onChange={handleTitle}
        />
        <label className="text-light" for="description">
          Description
        </label>
        <textarea
          className="Form-Input"
          type="text"
          id="description"
          value={description}
          onChange={handleDescription}
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
