import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { EDIT_POST_MUTATION } from "../GraphQL/Mutation";
import { GET_POST_BY_ID_QUERY } from "../GraphQL/Query";

interface PostParams {
  postId: string;
}

const EditPost = () => {
  const postId = useParams<PostParams>().postId;
  const history = useHistory();
  const [content, setContent] = useState("");
  const [editPost] = useMutation(EDIT_POST_MUTATION);

  const { loading, data, error } = useQuery(GET_POST_BY_ID_QUERY, {
    variables: { id: Number(postId) },
  });

  useEffect(() => {
    if (!loading && data) {
      setContent(data.getPostById.content);
    }
  }, [loading, data]);

  const postUpdateSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await editPost({ variables: { id: Number(postId), content } })
      .then(({ data }) => {
        history.push("/posts/" + postId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <React.Fragment>
      {data && (
        <div className="Form">
          <div className="Form__Title">Edit Post</div>
          <form className="Form__Form" onSubmit={postUpdateSubmitHandler}>
            <label className="text-light" htmlFor="title">
              Title
            </label>
            <input
              className="Form__Input"
              type="text"
              id="title"
              value={data.getPostById.title}
              disabled
            />
            <label className="text-light" htmlFor="content">
              Content
            </label>
            <textarea
              className="Form__TextArea"
              id="content"
              value={content}
              onChange={handleContentChange}
            />
            {error && <div className="Form-Error">{error}</div>}
            <button className="btn btn-primary" type="submit">
              Update Post
            </button>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};
export default EditPost;
