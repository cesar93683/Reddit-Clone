import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import CustomCard from "../components/CustomCard";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { GET_USER_QUERY } from "../GraphQL/Query";
import IPost from "../utils/interfaces/IPost";

interface UserParams {
  userId: string;
}

const User = () => {
  const param = useParams<UserParams>().userId;
  let userId = Number(param);
  const currentDate = Date.now();
  const { loading, data, error } = useQuery(GET_USER_QUERY, {
    variables: { userId },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      {data.getUser.posts.length === 0 && <h1>No Posts</h1>}
      {data.getUser.posts.map((post: IPost) => (
        <CustomCard
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

export default User;
