import React, { useMemo, useState } from "react";

import IPost from "../utils/interfaces/IPost";
import { useQuery } from "@apollo/client";
import { POSTS_QUERY } from "../GraphQL/Query";

import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/CustomCard";
import SortDropDown from "../components/SortDropDown";

const Home = () => {
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

  if (error || !data) {
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
