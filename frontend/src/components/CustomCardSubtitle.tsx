import React from "react";
import { Link } from "react-router-dom";

interface CustomCardSubtitleProps {
  authorId: number;
  username: string;
  timeSinceDateCreated: string;
  timeSinceDateUpdated: string;
}

export default function CustomCardSubtitle(props: CustomCardSubtitleProps) {
  const {
    authorId,
    username,
    timeSinceDateCreated,
    timeSinceDateUpdated,
  } = props;
  return (
    <small className="d-flex">
      <div>
        {"Posted by "}
        <Link className="text-body font-weight-bold" to={"/user/" + authorId}>
          {username}
        </Link>
      </div>
      <div className="ml-1">{timeSinceDateCreated}</div>
      {timeSinceDateCreated !== timeSinceDateUpdated ? (
        <div className="ml-1 font-italic">
          {"edited " + timeSinceDateUpdated}
        </div>
      ) : null}
    </small>
  );
}
