import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import IComment from "../../../utils/interfaces/IComment";
import Comment from "../../Post/components/Comment";

interface CommentWithPostTitleProps {
  className?: string;
  comment: IComment;
  currentDate: number;
}
const CommentWithPostTitle = (props: CommentWithPostTitleProps) => {
  const { className, comment, currentDate } = props;

  return (
    <Card className={className}>
      <Card.Body>
        <div>
          <Link className="text-body font-weight-bold" to="">
            {comment.author.username}
          </Link>
          {" commented on "}
          <Link className="text-body font-weight-bold" to="">
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
};

export default CommentWithPostTitle;
