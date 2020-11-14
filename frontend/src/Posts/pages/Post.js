import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/Card/Card";
import Comment from "../components/Comment";
import "./Post.scss";
import CommentForm from "../components/CommentForm";

const PostItem = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [post, setLoadedPost] = useState();
  const postId = useParams().postId;
  const history = useHistory();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts/" + postId
        );
        setLoadedPost(responseData.post);
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest, postId]);

  const onDelete = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/${postId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
  };

  const onSubmitComment = async (comment) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/${postId}/newcomment`,
        "POST",
        JSON.stringify({
          comment,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!post && error) {
    return <h1 className="text-light">An error occured.</h1>;
  }

  return (
    <div>
      {post && (
        <React.Fragment>
          <Card
            key={post.id}
            postId={post.id}
            title={post.title}
            creatorUsername={post.creatorUsername}
            numComments={post.numComments}
            description={post.description}
            creator={post.creator}
            dateCreated={post.dateCreated}
            userId={auth.userId}
            onDelete={onDelete}
          />
          <div className="Post__CommentSection">
            {auth.isLoggedIn && <CommentForm onSubmit={onSubmitComment} />}
            {post.comments.map((comment) => (
              <Comment
                key={comment.id}
                creator={comment.creator}
                creatorUsername={comment.creatorUsername}
                comment={comment.comment}
              />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default PostItem;
