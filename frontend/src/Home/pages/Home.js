import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../components/Card.js";
import "./Home.css";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Home = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts"
        );

        setLoadedPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);
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
            id={post.id}
            title={post.title}
            username={post.creatorUsername}
            votes={post.votes}
            numComments={post.numComments}
          />
        ))}
    </div>
  );
};

export default Home;
