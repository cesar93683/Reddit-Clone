import React, { useContext, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Comment from "./components/Comment";
import CommentForm from "./components/CommentForm";
import { useMutation, useQuery } from "@apollo/client";
import IComment from "../../utils/interfaces/IComment";
import { AuthContext } from "../../utils/auth-context";
import { POST_QUERY } from "../../GraphQL/Query";
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
  const history = useHistory();
  const currentDate = Date.now();
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [comments, setComments] = useState<IComment[]>([]);
  const [hasNewCommentBeenAdded, setHasNewCommentBeenAdded] = useState(false);

  const { loading, data, error } = useQuery(POST_QUERY, {
    variables: { id: postId },
  });

  useMemo(() => {
    setComments(
      data && data.post && data.post.comments ? data.post.comments : []
    );
  }, [data]);

  const onDeletePost = async () => {
    await deletePost({ variables: { id: postId } })
      .then(({ data }) => {})
      .catch((err) => {});
    history.push("/");
  };

  const onSubmitComment = async (content: string) => {
    await createComment({ variables: { postId, content } })
      .then(({ data: { createComment: newComment } }) => {
        setComments([newComment, ...comments]);
        setHasNewCommentBeenAdded(true);
      })
      .catch((err) => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data || !data.post) {
    return <h1>An error occured.</h1>;
  }

  return (
    <>
      <CustomCard
        className="my-2"
        key={data.post.id}
        post={data.post}
        currentDate={currentDate}
        userId={Number(auth.userId)}
        onDelete={onDeletePost}
      />
      {auth.isLoggedIn && (
        <CommentForm
          onSubmit={onSubmitComment}
          enableSubmit={hasNewCommentBeenAdded}
        />
      )}
      {comments.length === 0 && <h2>No Comments</h2>}
      <div className="px-3">
        {comments.map((comment: IComment) => (
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
