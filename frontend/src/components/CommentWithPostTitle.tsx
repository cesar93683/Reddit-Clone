import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import IComment from "../utils/interfaces/IComment";
import Comment from "./Comment";

interface CommentWithPostTitleProps {
  className?: string;
  comment: IComment;
  currentDate: number;
}
export default function CommentWithPostTitle(props: CommentWithPostTitleProps) {
  const { className, comment, currentDate } = props;
  const postId = comment?.post?.id ? comment.post.id : 0;
  const postTitle = comment?.post?.title ? comment.post.title : "";

  return (
    <Card className={className}>
      <Card.Body className="p-2">
        <div>
          <Link
            className="text-body font-weight-bold"
            to={"/user/" + comment.author.id}
          >
            {comment.author.username}
          </Link>
          {" commented on "}
          <Link className="text-body font-weight-bold" to={"/post/" + postId}>
            {postTitle}
          </Link>
        </div>
        <Comment
          comment={comment}
          currentDate={currentDate}
          postId={postId}
          showVoteSection={false}
        />
      </Card.Body>
    </Card>
  );
}
