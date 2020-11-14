import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../shared/components/Card/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";

const User = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [posts, setPosts] = useState();
  const userId = useParams().userId;
  const currentDate = Date.now();

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
    return <LoadingSpinner />;
  }

  if (error == "Could not find posts for the provided user id.") {
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
            postId={post.id}
            title={post.title}
            creatorUsername={post.creatorUsername}
            numComments={post.numComments}
            creator={post.creator}
            currentDate={currentDate}
            dateCreated={post.dateCreated}
            linkable
          />
        ))}
    </div>
  );
};

export default User;
