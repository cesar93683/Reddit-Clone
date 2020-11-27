import React from "react";
import { Link } from "react-router-dom";
import IPost from "../utils/interfaces/IPost";
import timeSince from "../utils/timeSince";
import { Button, Card } from "react-bootstrap";
import CustomCardSubtitle from "./CustomCardSubtitle";
import DeleteModalWithButton from "./DeleteModalWithButton";

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
        <CustomCardSubtitle
          authorId={authorId}
          timeSince={timeSince(currentDate, dateCreated)}
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

          {onDelete && authorId === Number(userId) && (
            <div>
              <Link className="mr-2" to={`/posts/${postId}/edit`}>
                <Button variant="outline-primary">EDIT</Button>
              </Link>
              <DeleteModalWithButton type="post" onDelete={onDelete} />
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
