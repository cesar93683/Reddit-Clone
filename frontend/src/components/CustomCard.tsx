import React from "react";
import { Link } from "react-router-dom";
import IPost from "../utils/interfaces/IPost";
import timeSince from "../utils/timeSince";
import { Button, Card } from "react-bootstrap";

interface CustomCardInterface {
  post: IPost;
  currentDate: number;
  linkable: boolean;
  userId: string | null;
  onDelete: (() => void) | null;
}

const CustomCard = (props: CustomCardInterface) => {
  const {
    post: {
      author: { id: authorId, username },
      title,
      dateCreated,
      id: postId,
      content,
      numComments,
    },
    userId,
    currentDate,
    linkable,
    onDelete,
  } = props;

  return (
    <Card className="my-2">
      <Card.Body>
        <Card.Subtitle className="d-flex justify-content-between">
          <div>
            {"Posted by "}
            <Link className="text-body" to={"/users/" + authorId}>
              {username}
            </Link>
          </div>
          <div>{timeSince(currentDate, dateCreated)}</div>
        </Card.Subtitle>
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

          {onDelete && authorId === Number(userId) && (
            <div>
              <Button variant="outline-primary">
                <Link to={`/posts/${postId}/edit`}>EDIT</Link>
              </Button>
              <Button variant="danger" className="ml-1" onClick={onDelete}>
                DELETE
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
