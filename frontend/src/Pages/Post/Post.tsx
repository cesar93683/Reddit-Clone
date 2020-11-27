import React, { useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Comment from "./components/Comment";
import CommentForm from "./components/CommentForm";
import { useMutation, useQuery } from "@apollo/client";
import IComment from "../../utils/interfaces/IComment";
import { AuthContext } from "../../utils/auth-context";
import { GET_POST_BY_ID_QUERY } from "../../GraphQL/Query";
import {
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
} from "../../GraphQL/Mutation";
import LoadingSpinner from "../../components/LoadingSpinner";
import CustomCard from "../../components/CustomCard";

interface PostParams {
  postId: string;
}

const PostItem = () => {
  const auth = useContext(AuthContext);
  const postId = Number(useParams<PostParams>().postId);
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [newComment, setNewComment] = useState<IComment | null>(null);
  const { loading, data, error } = useQuery(GET_POST_BY_ID_QUERY, {
    variables: { id: postId },
  });
  const history = useHistory();
  const currentDate = Date.now();

  const onDeletePost = async () => {
    await deletePost({ variables: { id: postId } })
      .then(({ data }) => {})
      .catch((err) => {});
    history.push("/");
  };

  const onSubmitComment = async (content: string) => {
    await createComment({ variables: { postId, content } })
      .then(({ data: { createComment } }) => {
        setNewComment(createComment);
      })
      .catch((err) => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data || !data.getPostById) {
    return <h1>An error occured.</h1>;
  }

  return (
    <>
      <CustomCard
        className="my-2"
        key={data.getPostById.id}
        post={data.getPostById}
        currentDate={currentDate}
        userId={Number(auth.userId)}
        onDelete={onDeletePost}
      />
      {auth.isLoggedIn && (
        <CommentForm onSubmit={onSubmitComment} enableSubmit={!!newComment} />
      )}
      {data.getPostById.comments.length === 0 && !newComment && (
        <h2>No Comments</h2>
      )}
      <div className="px-3">
        {newComment && (
          <Comment
            className="my-2"
            comment={newComment}
            currentDate={currentDate}
            postId={postId}
            userId={Number(auth.userId)}
          />
        )}
        {data.getPostById.comments.map((comment: IComment) => (
          <Comment
            className="my-2"
            key={comment.id}
            comment={comment}
            currentDate={currentDate}
            postId={postId}
            userId={Number(auth.userId)}
          />
        ))}
      </div>
    </>
  );
};

export default PostItem;
