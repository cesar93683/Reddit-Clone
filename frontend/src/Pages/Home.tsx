import { gql, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/PostCard";
import SortDropDown from "../components/SortDropDown";
import IPost from "../utils/interfaces/IPost";

export const POSTS_QUERY = gql`
  query($cursor: Int) {
    posts(cursor: $cursor, limit: 10) {
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
      cursor
      hasMore
    }
  }
`;

export default function Home() {
  const currentDate = Date.now();
  const { loading, data, error, fetchMore } = useQuery(POSTS_QUERY);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [cursor, setCursor] = useState(0);
  const [votesActive, setVotesActive] = useState(false);
  const [datePostedActive, setDatePostedActive] = useState(true);
  const [morePostsActive, setMorePostsActive] = useState(true);

  useMemo(() => {
    if (data?.posts?.posts?.length > 0) {
      setPosts(
        [...data.posts.posts].sort(
          (a: IPost, b: IPost) => b.dateCreated - a.dateCreated
        )
      );
      setCursor(data.posts.cursor);
      if (!data.posts.hasMore) {
        setMorePostsActive(false);
      }
    }
  }, [data]);

  const sortByVotes = () => {
    setPosts([...posts].sort((a, b) => b.numVotes - a.numVotes));
    setVotesActive(true);
    setDatePostedActive(false);
  };

  const sortByDatePosted = () => {
    setPosts([...posts].sort((a, b) => b.dateCreated - a.dateCreated));
    setVotesActive(false);
    setDatePostedActive(true);
  };

  const onFetchMore = () => {
    fetchMore({
      query: POSTS_QUERY,
      variables: { cursor },
      updateQuery: (_previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult?.posts?.posts?.length > 0) {
          const newPosts = [
            ...posts,
            ...fetchMoreResult.posts.posts,
          ].sort((a: IPost, b: IPost) =>
            datePostedActive
              ? b.dateCreated - a.dateCreated
              : b.numVotes - a.numVotes
          );
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
      <SortDropDown
        sortByVotes={sortByVotes}
        votesActive={votesActive}
        sortByDatePosted={sortByDatePosted}
        datePostedActive={datePostedActive}
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
