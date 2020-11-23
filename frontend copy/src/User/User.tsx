import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import Card from "../shared/components/Card/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import IPost from "../shared/interfaces/IPost";

interface UserParams {
  userId: string;
}

const GET_USER_MUTATION = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      id
      username
      posts {
        id
        title
        author {
          id
          username
        }
      }
    }
  }
`;

const User = () => {
  const param = useParams<UserParams>().userId;
  let userId = Number(param);
  const currentDate = Date.now();
  const { loading, data, error } = useQuery(GET_USER_MUTATION, {
    variables: { userId },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      {data && data.getUser.posts.length === 0 && (
        <h1 className="text-light">No Posts</h1>
      )}
      {data &&
        data.getUser.posts.map((post: IPost) => (
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

export default User;
