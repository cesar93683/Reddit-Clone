import React, { useEffect, useState } from "react";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import Card from "../shared/components/Card/Card";

import { useHttpClient } from "../shared/hooks/http-hook";
import PostInterface from "../shared/interfaces/PostInterface";

const Home = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [posts, setPosts] = useState<PostInterface[]>();
  const currentDate = Date.now();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/posts`
        );

        setPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!posts && error) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      {posts && posts.length === 0 && <h1 className="text-light">No Posts</h1>}
      {posts &&
        posts.map((post) => (
          <Card
            key={post.id}
            post={post}
            currentDate={currentDate}
            linkable
            onDelete={null}
            userId={null}
          />
        ))}
    </div>
  );
};

export default Home;
