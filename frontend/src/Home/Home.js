import React, { useEffect, useState } from "react";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import Card from "../shared/components/Card/Card";
import "./Home.css";

import { useHttpClient } from "../shared/hooks/http-hook";

const Home = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [posts, setPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts"
        );

        setPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!posts && !error) {
    return <h2>An error occured.</h2>;
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
            numComments={post.numComments}
            creator={post.creator}
            linkable
          />
        ))}
    </div>
  );
};

export default Home;
