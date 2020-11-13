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
          "http://localhost:5000/api/posts/" + postId
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
        `http://localhost:5000/api/posts/${postId}`,
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
    } catch (err) {
      console.log(err);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post && !error) {
    return (
      <div className="center">
        <h2>An error occured.</h2>
      </div>
    );
  }

  return (
    <React.Fragment>
      {post && (
        <form onSubmit={postUpdateSubmitHandler}>
          <div style={{ color: "white" }}>{post.title}</div>
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
          />
          <button type="submit">UPDATE POST</button>
        </form>
      )}
    </React.Fragment>
  );
};
export default EditPost;
