import { gql, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/PostCard";
import SortDropDown from "../components/SortDropDown";
import IPost from "../utils/interfaces/IPost";

export const POSTS_QUERY = gql`
  query {
    posts {
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
  const { loading, data, error } = useQuery(POSTS_QUERY);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [topActive, setTopActive] = useState(false);
  const [newActive, setNewActive] = useState(true);

  useMemo(() => {
    if (data) {
      setPosts(
        [...data.posts].sort(
          (a: IPost, b: IPost) => b.dateCreated - a.dateCreated
        )
      );
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
    </div>
  );
}
