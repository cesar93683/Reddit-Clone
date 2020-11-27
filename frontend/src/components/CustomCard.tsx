import React from "react";
import { Link } from "react-router-dom";
import IPost from "../utils/interfaces/IPost";
import timeSince from "../utils/timeSince";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "./CustomCardSubtitle";
import DeleteModalWithButton from "./DeleteModalWithButton";
import VoteSection from "./VoteSection";

interface CustomCardProps {
  post: IPost;
  currentDate: number;
  userId?: number | null;
  linkable?: boolean;
  onDelete?: (() => void) | null;
  className?: string;
}

const CustomCard = (props: CustomCardProps) => {
  const {
    post: {
      id: postId,
      title,
      content,
      author: { id: authorId, username },
      numComments,
      numVotes,
      dateCreated,
      dateUpdated,
    },
    userId,
    currentDate,
    linkable,
    onDelete,
    className,
  } = props;

  return (
    <Card className={className}>
      <Card.Body className="d-flex">
        <VoteSection numVotes={numVotes} postId={postId} />
        <div className="w-100">
          <CustomCardSubtitle
            authorId={authorId}
            timeSinceDateCreated={timeSince(currentDate, dateCreated)}
            timeSinceDateUpdated={timeSince(currentDate, dateUpdated)}
            username={username}
          />
          <Card.Title>
            {linkable ? (
              <Link className="text-body" to={"/posts/" + postId}>
                {title}
              </Link>
            ) : (
              <div>{title}</div>
            )}
          </Card.Title>
          {content && <Card.Text>{content}</Card.Text>}
          <div className="d-flex justify-content-between align-items-center">
            {linkable ? (
              <Link className="text-body" to={"/posts/" + postId}>
                {numComments} Comment
                {numComments === 1 ? "" : "s"}
              </Link>
            ) : (
              <div>
                {numComments} Comment
                {numComments === 1 ? "" : "s"}
              </div>
            )}

            {onDelete && authorId === userId && (
              <div>
                <Link className="mr-2" to={`/posts/${postId}/edit`}>
                  <Button variant="outline-primary">EDIT</Button>
                </Link>
                <DeleteModalWithButton type="post" onDelete={onDelete} />
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
