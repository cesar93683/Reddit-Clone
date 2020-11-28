import { gql, useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
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
    user(id: $id) {
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
        id
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
  const [postsAndComments, setPostsAndComments] = useState<
    IPost[] & IComment[]
  >([]);
  const [topActive, setTopActive] = useState(false);
  const [newActive, setNewActive] = useState(true);

  useMemo(() => {
    if (data && data.user) {
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
      setPostsAndComments(
        [...data.user.comments, ...data.user.posts].sort(
          (a: IPost | IComment, b: IPost | IComment) =>
            b.dateCreated - a.dateCreated
        )
      );
    }
  }, [data]);

  const sortByVotes = () => {
    setPosts([...posts].sort((a, b) => b.numVotes - a.numVotes));
    setComments([...comments].sort((a, b) => b.numVotes - a.numVotes));
    setPostsAndComments(
      [...data.user.comments, ...data.user.posts].sort(
        (a: IPost | IComment, b: IPost | IComment) => b.numVotes - a.numVotes
      )
    );
    setTopActive(true);
    setNewActive(false);
  };

  const sortByNew = () => {
    setPosts([...posts].sort((a, b) => b.dateCreated - a.dateCreated));
    setComments([...comments].sort((a, b) => b.dateCreated - a.dateCreated));
    setPostsAndComments(
      [...data.user.comments, ...data.user.posts].sort(
        (a: IPost | IComment, b: IPost | IComment) =>
          b.dateCreated - a.dateCreated
      )
    );
    setTopActive(false);
    setNewActive(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data.user) {
    return <h1>An error occured.</h1>;
  }

  const sortDropDown = (
    <SortDropDown
      className="mt-2"
      sortByVotes={sortByVotes}
      topActive={topActive}
      sortByNew={sortByNew}
      newActive={newActive}
    />
  );

  return (
    <div>
      <Tabs defaultActiveKey="overview">
        <Tab eventKey="overview" title="Overview">
          {postsAndComments.length === 0 ? (
            <h1>No posts or comments</h1>
          ) : (
            <>
              {sortDropDown}
              {postsAndComments.map((item: IPost | IComment) =>
                item.__typename === "Post" ? (
                  <CustomCard
                    className="my-2"
                    key={"post" + item.id}
                    post={item as IPost}
                    currentDate={currentDate}
                    linkable
                  />
                ) : (
                  <CommentWithPostTitle
                    className="my-2"
                    key={"comment" + item.id}
                    comment={item as IComment}
                    currentDate={currentDate}
                  />
                )
              )}
            </>
          )}
        </Tab>
        <Tab eventKey="posts" title="Posts">
          {posts.length === 0 ? (
            <h1>No Posts</h1>
          ) : (
            <>
              {sortDropDown}
              {posts.map((post: IPost) => (
                <CustomCard
                  className="my-2"
                  key={post.id}
                  post={post}
                  currentDate={currentDate}
                  linkable
                />
              ))}
            </>
          )}
        </Tab>
        <Tab eventKey="comments" title="Comments">
          {comments.length === 0 ? (
            <h1>No Comments</h1>
          ) : (
            <>
              {sortDropDown}
              {comments.map((comment) => (
                <CommentWithPostTitle
                  className="my-2"
                  key={comment.id}
                  comment={comment}
                  currentDate={currentDate}
                />
              ))}
            </>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default User;
