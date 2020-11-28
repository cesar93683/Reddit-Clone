import { gql, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CustomCard from "../../components/CustomCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import SortDropDown from "../../components/SortDropDown";
import IComment from "../../utils/interfaces/IComment";
import IPost from "../../utils/interfaces/IPost";
import CommentWithPostTitle from "./Components/CommentWithPostTitle";

interface UserParams {
  id: string;
}

const USER_QUERY = gql`
  query($id: Int!) {
    user(userId: $id) {
      id
      username
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
      comments {
        content
        numVotes
        dateCreated
        dateUpdated
        author {
          id
          username
        }
        post {
          id
          title
        }
      }
    }
  }
`;

const User = () => {
  let userIdFromParam = Number(useParams<UserParams>().id);
  const currentDate = Date.now();
  const { loading, data, error } = useQuery(USER_QUERY, {
    variables: { id: userIdFromParam },
  });
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [topActive, setTopActive] = useState(false);
  const [newActive, setNewActive] = useState(true);

  useMemo(() => {
    if (data) {
      setPosts(
        [...data.user.posts].sort(
          (a: IPost, b: IPost) => b.dateCreated - a.dateCreated
        )
      );
      setComments(
        [...data.user.comments].sort(
          (a: IComment, b: IComment) => b.dateCreated - a.dateCreated
        )
      );
    }
  }, [data]);

  const sortByVotes = () => {
    setPosts([...posts].sort((a, b) => b.numVotes - a.numVotes));
    setComments([...comments].sort((a, b) => b.numVotes - a.numVotes));
    setTopActive(true);
    setNewActive(false);
  };

  const sortByNew = () => {
    setPosts([...posts].sort((a, b) => b.dateCreated - a.dateCreated));
    setComments([...comments].sort((a, b) => b.dateCreated - a.dateCreated));
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
        <CustomCard
          className="my-2"
          key={post.id}
          post={post}
          currentDate={currentDate}
          linkable
        />
      ))}
      {comments.map((comment) => (
        <CommentWithPostTitle
          className="my-2"
          key={comment.id}
          comment={comment}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};

export default User;
