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

  return (
    <Card className={className}>
      <Card.Body>
        <div>
          <Link
            className="text-body font-weight-bold"
            to={"user/" + comment.author.id}
          >
            {comment.author.username}
          </Link>
          {" commented on "}
          <Link
            className="text-body font-weight-bold"
            to={"post/" + comment.post.id}
          >
            {comment.post.title}
          </Link>
        </div>
        <Comment
          currentDate={currentDate}
          comment={comment}
          postId={comment.post.id}
        />
      </Card.Body>
    </Card>
  );
}
