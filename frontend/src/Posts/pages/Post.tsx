import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/Card/Card";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { useMutation, useQuery } from "@apollo/client";
import IComment from "../../shared/interfaces/IComment";
import { AuthContext } from "../../shared/context/auth-context";
import { GET_POST_BY_ID_QUERY } from "../../GraphQL/Query";
import {
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
} from "../../GraphQL/Mutation";

interface PostParams {
  postId: string;
}

const PostItem = () => {
  const auth = useContext(AuthContext);

  const postId = Number(useParams<PostParams>().postId);
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
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
      .then(({ data }) => {})
      .catch((err) => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      {data && (
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
            {auth.isLoggedIn && <CommentForm onSubmit={onSubmitComment} />}
            {data.getPostById.comments.length === 0 && (
              <h2 className="text-light">No Comments</h2>
            )}
            {data.getPostById.comments.map((comment: IComment) => (
              <Comment
                key={comment.id}
                comment={comment}
                currentDate={currentDate}
              />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default PostItem;
