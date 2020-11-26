import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface CustomCardSubtitleProps {
  authorId: number;
  username: string;
  timeSince: string;
}

const CustomCardSubtitle = ({
  username,
  authorId,
  timeSince,
}: CustomCardSubtitleProps) => {
  return (
    <Card.Subtitle className="d-flex justify-content-between">
      <div>
        {"Posted by "}
        <Link className="text-body" to={"/users/" + authorId}>
          {username}
        </Link>
      </div>
      <div>{timeSince}</div>
    </Card.Subtitle>
  );
};

export default CustomCardSubtitle;
