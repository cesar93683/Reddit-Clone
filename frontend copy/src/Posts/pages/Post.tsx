import React from "react";
import { useParams, useHistory } from "react-router-dom";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/Card/Card";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { gql, useQuery } from "@apollo/client";
import IComment from "../../shared/interfaces/IComment";

interface PostParams {
  postId: string;
}

const GET_POST_BY_ID = gql`
  query($id: Int!) {
    getPostById(id: $id) {
      id
      title
      content
      author {
        id
        username
      }
      comments {
        id
        content
        author {
          id
          username
        }
      }
    }
  }
`;

const PostItem = () => {
  const token = localStorage.getItem("token");

  const postId = Number(useParams<PostParams>().postId);
  const { loading, data, error } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  });
  const history = useHistory();
  const currentDate = Date.now();

  const onDelete = async () => {
    history.push("/");
  };

  const onSubmitComment = async (comment: string) => {};

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
          />
          <div className="bg-dark-gray p-3">
            {token && <CommentForm onSubmit={onSubmitComment} />}
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
