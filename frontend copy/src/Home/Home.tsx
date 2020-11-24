import React from "react";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import Card from "../shared/components/Card/Card";

import IPost from "../shared/interfaces/IPost";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS_QUERY } from "../GraphQL/Query";

const Home = () => {
  const currentDate = Date.now();
  const { loading, data, error } = useQuery(GET_ALL_POSTS_QUERY);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      {data && data.getAllPosts.length === 0 && (
        <h1 className="text-light">No Posts</h1>
      )}
      {data &&
        data.getAllPosts.map((post: IPost) => (
          <Card
            key={post.id}
            post={post}
            currentDate={currentDate}
            linkable
            userId={null}
            onDelete={null}
          />
        ))}
    </div>
  );
};

export default Home;
