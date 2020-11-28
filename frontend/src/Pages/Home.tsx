import React, { useMemo, useState } from "react";

import IPost from "../utils/interfaces/IPost";
import { useQuery } from "@apollo/client";
import { POSTS_QUERY } from "../GraphQL/Query";

import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/CustomCard";
import { Dropdown, DropdownButton } from "react-bootstrap";

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return <h1>An error occured.</h1>;
  }

  if (posts.length === 0) {
    return <h1>No Posts</h1>;
  }

  console.log(posts);

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

  return (
    <div>
      <DropdownButton title="Sort By">
        <Dropdown.Item onClick={sortByVotes} active={topActive}>
          Top
        </Dropdown.Item>
        <Dropdown.Item onClick={sortByNew} active={newActive}>
          New
        </Dropdown.Item>
      </DropdownButton>
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
