import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/Card/Card";
import "./Post.css";

const PostItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [post, setLoadedPost] = useState();
  const id = useParams().id;
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
    <div className="Post center">
      {error && <div>{error}</div>}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && post && (
        <div>
          <Card
            key={post.id}
            postId={post.id}
            title={post.title}
            creatorUsername={post.creatorUsername}
            votes={post.votes}
            numComments={post.numComments}
            description={post.description}
            creatorId={post.creatorId}
            usedId={post.usedId}
          />
        </div>
      )}
    </div>
  );
};

export default PostItem;
