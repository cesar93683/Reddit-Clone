import React, { useContext, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { useMutation, useQuery } from "@apollo/client";
import IComment from "../utils/interfaces/IComment";
import { AuthContext } from "../utils/auth-context";
import { POST_QUERY } from "../GraphQL/Query";
import {
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
} from "../GraphQL/Mutation";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/CustomCard";
import SortDropDown from "../components/SortDropDown";

interface PostParams {
  postId: string;
}

const PostItem = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const postId = Number(useParams<PostParams>().postId);
  const history = useHistory();
  const currentDate = Date.now();
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [comments, setComments] = useState<IComment[]>([]);
  const [hasNewCommentBeenAdded, setHasNewCommentBeenAdded] = useState(false);
  const [topActive, setTopActive] = useState(false);
  const [newActive, setNewActive] = useState(true);

  const { loading, data, error } = useQuery(POST_QUERY, {
    variables: { id: postId },
  });

  useMemo(() => {
    if (data && data.post) {
      setComments(
        [...data.post.comments].sort(
          (a: IComment, b: IComment) => b.dateCreated - a.dateCreated
        )
      );
    }
  }, [data]);

  const sortByVotes = () => {
    setComments([...comments].sort((a, b) => b.numVotes - a.numVotes));
    setTopActive(true);
    setNewActive(false);
  };

  const sortByNew = () => {
    setComments([...comments].sort((a, b) => b.dateCreated - a.dateCreated));
    setTopActive(false);
    setNewActive(true);
  };

  const onDeletePost = async () => {
    await deletePost({ variables: { id: postId } })
      .then(() => {})
      .catch(() => {});
    history.push("/");
  };

  const onSubmitComment = async (content: string) => {
    await createComment({ variables: { postId, content } })
      .then(({ data: { createComment: newComment } }) => {
        setComments([newComment, ...comments]);
        setHasNewCommentBeenAdded(true);
      })
      .catch(() => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h1>An error occured.</h1>;
  }

  return (
    <>
      <CustomCard
        className="my-2"
        key={data.post.id}
        post={data.post}
        currentDate={currentDate}
        onDelete={onDeletePost}
      />
      {isLoggedIn && (
        <CommentForm
          onSubmit={onSubmitComment}
          enableSubmit={hasNewCommentBeenAdded}
        />
      )}
      <SortDropDown
        sortByVotes={sortByVotes}
        topActive={topActive}
        sortByNew={sortByNew}
        newActive={newActive}
        disabled={comments.length === 0}
      />
      {comments.length === 0 ? <h2>No Comments</h2> : null}
      <div className="px-3">
        {comments.map((comment: IComment) => (
          <Comment
            className="my-2"
            key={comment.id}
            comment={comment}
            currentDate={currentDate}
            postId={postId}
          />
        ))}
      </div>
    </>
  );
};

export default PostItem;
