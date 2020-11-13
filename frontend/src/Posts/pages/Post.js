import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PostItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const id = useParams().id;
  console.log(id);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts/" + id
        );
        setLoadedPost(responseData.post);
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest]);

  return (
    <div>
      {error && <div>{error}</div>}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPost && (
        <div style={{ color: "white" }}>
          <div>{loadedPost.title}</div>
          <div>{loadedPost.description}</div>
          <div>{loadedPost.creatorUsername}</div>
          <div>{loadedPost.votes}</div>
          {auth.userId === loadedPost.creatorId && (
            <div to={`/post/${loadedPost.id}/edit`}>EDIT</div>
          )}
          {auth.userId === loadedPost.creatorId && <div>DELETE</div>}
        </div>
      )}
    </div>
  );
};

export default PostItem;
