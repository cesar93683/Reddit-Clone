import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const EditPost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [post, setLoadedPost] = useState();
  const postId = useParams().postId;
  const history = useHistory();
  const [description, setDescription] = useState();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`
        );
        setLoadedPost(responseData.post);
        setDescription(responseData.post.description);
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest, postId]);

  const postUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`,
        "PATCH",
        JSON.stringify({
          description: description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/posts/" + postId);
    } catch (err) {}
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <React.Fragment>
      {post && (
        <div className="Form">
          <div className="Form__Title">Edit Post</div>
          <form className="Form__Form" onSubmit={postUpdateSubmitHandler}>
            <label className="text-light" for="title">
              Title
            </label>
            <input
              className="Form__Input"
              type="text"
              id="title"
              value={post.title}
              disabled
            />
            <label className="text-light" for="description">
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
              Update Post
            </button>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};
export default EditPost;
