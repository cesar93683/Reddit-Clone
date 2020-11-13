import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../shared/components/Card/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";

const User = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts/user/" + userId
        );

        setLoadedPosts(responseData.posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [sendRequest, userId]);

  return (
    <div className="Home center">
      {error && <div>{error}</div>}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading &&
        loadedPosts &&
        loadedPosts.map((post) => (
          <Card
            key={post.id}
            postId={post.id}
            title={post.title}
            creatorUsername={post.creatorUsername}
            votes={post.votes}
            numComments={post.numComments}
            creator={post.creator}
            linkable
          />
        ))}
    </div>
  );
};

export default User;
