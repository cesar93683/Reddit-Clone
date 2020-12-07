import { gql, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/PostCard";
import SortDropDown from "../components/SortDropDown";
import IPost from "../utils/interfaces/IPost";

export const POSTS_QUERY = gql`
  query($cursor: Int) {
    posts(cursor: $cursor) {
      id
      title
      numComments
      numVotes
      dateCreated
      dateUpdated
      author {
        id
        username
      }
    }
  }
`;

export default function Home() {
  const currentDate = Date.now();
  const { loading, data, error, fetchMore } = useQuery(POSTS_QUERY);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [lastId, setLastId] = useState(0);
  const [topActive, setTopActive] = useState(false);
  const [newActive, setNewActive] = useState(true);
  const [morePostsActive, setMorePostsActive] = useState(true);
  const limit = 10;

  useMemo(() => {
    if (data?.posts?.length > 0) {
      setPosts(
        [...data.posts].sort(
          (a: IPost, b: IPost) => b.dateCreated - a.dateCreated
        )
      );
      setLastId(data.posts[data.posts.length - 1].id);
      if (data.posts.length !== limit) {
        setMorePostsActive(false);
      }
    }
  }, [data]);

  const sortByVotes = () => {
    setPosts([...posts].sort((a, b) => b.numVotes - a.numVotes));
    setTopActive(true);
    setNewActive(false);
  };

  const sortByNew = () => {
    setPosts([...posts].sort((a, b) => b.dateCreated - a.dateCreated));
    setTopActive(false);
    setNewActive(true);
  };

  const onFetchMore = () => {
    fetchMore({
      query: POSTS_QUERY,
      variables: { cursor: lastId },
      updateQuery: (_previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult?.posts?.length > 0) {
          const newPosts = [
            ...data.posts,
            ...fetchMoreResult.posts,
          ].sort((a: IPost, b: IPost) =>
            newActive ? b.dateCreated - a.dateCreated : b.numVotes - a.numVotes
          );
          setPosts(newPosts);
        } else {
          setMorePostsActive(false);
        }
        if (fetchMoreResult?.posts?.length !== limit) {
          setMorePostsActive(false);
        }
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
      <SortDropDown
        sortByVotes={sortByVotes}
        topActive={topActive}
        sortByNew={sortByNew}
        newActive={newActive}
      />
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
