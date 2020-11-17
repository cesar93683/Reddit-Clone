import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/Card/Card";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import IPost from "../../shared/interfaces/IPost";

interface PostParams {
  postId: string;
}

const PostItem = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [post, setLoadedPost] = useState<IPost>();
  const postId = useParams<PostParams>().postId;
  const history = useHistory();
  const currentDate = Date.now();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`
        );
        setLoadedPost(responseData.post);
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest, postId]);

  const onDelete = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
  };

  const onSubmitComment = async (comment: string) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/newcomment`,
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
            post={post}
            currentDate={currentDate}
            userId={auth.userId}
            onDelete={onDelete}
            linkable={false}
          />
          <div className="bg-dark-gray p-3">
            {auth.isLoggedIn && <CommentForm onSubmit={onSubmitComment} />}
            {post.comments.map((comment) => (
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
