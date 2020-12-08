import { DocumentNode, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import IPost from "../utils/interfaces/IPost";
import LoadingSpinner from "./LoadingSpinner";
import CustomCard from "./PostCard";

interface PostsProps {
  query: DocumentNode;
  currentDate: number;
}

export default function Posts({ query, currentDate, className }: PostsProps) {
  const { loading, data, error, fetchMore } = useQuery(query);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [cursor, setCursor] = useState(0);
  const [morePostsActive, setMorePostsActive] = useState(true);

  useMemo(() => {
    if (data?.posts?.posts?.length > 0) {
      setPosts(data.posts.posts);
      setCursor(data.posts.cursor);
      if (!data.posts.hasMore) {
        setMorePostsActive(false);
      } else {
        setMorePostsActive(true);
      }
    }
  }, [data]);

  const onFetchMore = () => {
    fetchMore({
      query: query,
      variables: { cursor },
      updateQuery: (_previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult?.posts?.posts?.length > 0) {
          const newPosts = [...posts, ...fetchMoreResult.posts.posts];
          setPosts(newPosts);
        }
        if (!fetchMoreResult?.posts?.hasMore) {
          setMorePostsActive(false);
        }
        setCursor(data.posts.cursor);
      },
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h1>An error occured.</h1>;
  }

  if (posts.length === 0) {
    return <h1>No Posts</h1>;
  }

  return (
    <div>
      {posts.map((post: IPost) => (
        <div data-testid="post" key={post.id}>
          <CustomCard
            className="my-2"
            post={post}
            currentDate={currentDate}
            linkable
          />
        </div>
      ))}
      {morePostsActive ? (
        <Button onClick={onFetchMore}>More Posts</Button>
      ) : null}
    </div>
  );
}
