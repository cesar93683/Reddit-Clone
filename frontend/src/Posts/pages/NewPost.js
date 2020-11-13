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
    <div>
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <input type="text" value={title} onChange={handleTitle} />
        <input type="text" value={description} onChange={handleDescription} />
        {error && <div className="Auth-Error">{error}</div>}
        <button type="submit">New Post</button>
      </form>
    </div>
  );
};

export default NewPost;
