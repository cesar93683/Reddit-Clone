import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../shared/components/Card/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";
import IPost from "../shared/interfaces/IPost";

interface UserParams {
  userId: string;
}

const User = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [posts, setPosts] = useState<IPost[]>();
  const userId = useParams<UserParams>().userId;
  const currentDate = Date.now();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/posts/user/${userId}`
        );

        setPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error === "Could not find posts for the provided user id.") {
    return <h1 className="text-light">User has no posts.</h1>;
  }

  if (error) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
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

export default User;
