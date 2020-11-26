import React, { useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Comment from "./Post/components/Comment";
import CommentForm from "./Post/components/CommentForm";
import { useMutation, useQuery } from "@apollo/client";
import IComment from "../utils/interfaces/IComment";
import { AuthContext } from "../utils/auth-context";
import { GET_POST_BY_ID_QUERY } from "../GraphQL/Query";
import {
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
} from "../GraphQL/Mutation";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Card from "../components/Card/Card";

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

  const onDelete = async () => {
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
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      <React.Fragment>
        <Card
          key={data.getPostById.id}
          post={data.getPostById}
          currentDate={currentDate}
          onDelete={onDelete}
          linkable={false}
          userId={auth.userId}
        />
        <div className="bg-dark-gray p-3">
          {auth.isLoggedIn && (
            <CommentForm
              onSubmit={onSubmitComment}
              enableSubmit={!!newComment}
            />
          )}
          {data.getPostById.comments.length === 0 && !newComment && (
            <h2 className="text-light">No Comments</h2>
          )}
          {newComment && (
            <Comment
              key={newComment.id}
              comment={newComment}
              currentDate={currentDate}
              postId={postId}
              userId={auth.userId}
            />
          )}
          {data.getPostById.comments
            .slice(0)
            .reverse()
            .map((comment: IComment) => (
              <Comment
                key={comment.id}
                comment={comment}
                currentDate={currentDate}
                postId={postId}
                userId={auth.userId}
              />
            ))}
        </div>
      </React.Fragment>
    </div>
  );
};

export default PostItem;
