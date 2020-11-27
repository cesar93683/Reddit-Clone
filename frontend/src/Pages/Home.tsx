import React from "react";

import IPost from "../utils/interfaces/IPost";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS_QUERY } from "../GraphQL/Query";

import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/CustomCard";

const Home = () => {
  const currentDate = Date.now();
  const { loading, data, error } = useQuery(GET_ALL_POSTS_QUERY);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return <h1>An error occured.</h1>;
  }

  if (data.getAllPosts.length === 0) {
    return <h1>No Posts</h1>;
  }

  return (
    <div>
      {data.getAllPosts.map((post: IPost) => (
        <CustomCard
          className="my-2"
          key={post.id}
          post={post}
          currentDate={currentDate}
          linkable
        />
      ))}
    </div>
  );
};

export default Home;
