import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomCard from "../components/PostCard";
import SortDropDown from "../components/SortDropDown";
import { AuthContext } from "../utils/auth-context";
import IComment from "../utils/interfaces/IComment";

export const POST_QUERY = gql`
  query($id: Int!) {
    post(id: $id) {
      id
      title
      content
      numComments
      numVotes
      dateCreated
      dateUpdated
      author {
        id
        username
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
      }
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation($postId: Int!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      numVotes
      dateCreated
      dateUpdated
      author {
        id
        username
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation($id: Int!) {
    deletePost(id: $id) {
      message
    }
  }
`;

interface PostParams {
  id: string;
}

export default function Post() {
  const { userId } = useContext(AuthContext);
  const id = Number(useParams<PostParams>().id);
  const history = useHistory();
  const currentDate = Date.now();
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [deletePost] = useMutation(DELETE_POST_MUTATION);
  const [comments, setComments] = useState<IComment[]>([]);
  const [hasNewCommentBeenAdded, setHasNewCommentBeenAdded] = useState(false);
  const [votesActive, setVotesActive] = useState(false);
  const [datePostedActive, setDatePostedActive] = useState(true);

  const { loading, data, error } = useQuery(POST_QUERY, {
    variables: { id },
  });

  useMemo(() => {
    if (data?.post?.comments) {
      setComments(
        [...data.post.comments].sort(
          (a: IComment, b: IComment) => b.dateCreated - a.dateCreated
        )
      );
    }
  }, [data]);

  const sortByVotes = () => {
    setComments([...comments].sort((a, b) => b.numVotes - a.numVotes));
    setVotesActive(true);
    setDatePostedActive(false);
  };

  const sortByDatePosted = () => {
    setComments([...comments].sort((a, b) => b.dateCreated - a.dateCreated));
    setVotesActive(false);
    setDatePostedActive(true);
  };

  const onDeletePost = async () => {
    await deletePost({ variables: { id } })
      .then(() => {})
      .catch(() => {});
    history.push("/");
  };

  const onSubmitComment = async (content: string) => {
    await createComment({ variables: { postId: id, content } })
      .then(({ data: { createComment: newComment } }) => {
        setComments([newComment, ...comments]);
        setHasNewCommentBeenAdded(true);
      })
      .catch(() => {});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data.post) {
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
      {userId ? (
        <CommentForm
          onSubmit={onSubmitComment}
          enableSubmit={hasNewCommentBeenAdded}
        />
      ) : null}
      <SortDropDown
        sortByVotes={sortByVotes}
        votesActive={votesActive}
        sortByDatePosted={sortByDatePosted}
        datePostedActive={datePostedActive}
        disabled={comments.length === 0}
      />
      {comments.length === 0 ? <h2>No Comments</h2> : null}
      <div className="px-3">
        {comments.map((comment: IComment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentDate={currentDate}
            postId={id}
            showVoteSection
            className="my-2"
          />
        ))}
      </div>
    </>
  );
}
