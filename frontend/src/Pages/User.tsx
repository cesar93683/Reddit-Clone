import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import CustomCard from "../components/CustomCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { USER_QUERY } from "../GraphQL/Query";
import IPost from "../utils/interfaces/IPost";

interface UserParams {
  userId: string;
}

const User = () => {
  const param = useParams<UserParams>().userId;
  let userId = Number(param);
  const currentDate = Date.now();
  const { loading, data, error } = useQuery(USER_QUERY, {
    variables: { userId },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data || !data.user) {
    return <h1>An error occured.</h1>;
  }

  return (
    <div>
      {data.user.posts.length === 0 && <h1>No Posts</h1>}
      {data.user.posts.map((post: IPost) => (
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

export default User;
