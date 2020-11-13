import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../shared/components/Card/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";

const User = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [posts, setPosts] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts/user/" + userId
        );

        setPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!posts && !error) {
    return (
      <div className="center">
        <h2>An error occured.</h2>
      </div>
    );
  }
  return (
    <div className="Home center">
      {posts &&
        posts.map((post) => (
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
