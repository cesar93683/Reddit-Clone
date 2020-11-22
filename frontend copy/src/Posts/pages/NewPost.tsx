import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./EditPost";

const NewPost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };
  const postSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
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
        <label className="text-light" htmlFor="description">
          Description
        </label>
        <textarea
          className="Form__TextArea"
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
