import React from "react";
import { Link } from "react-router-dom";

interface CustomCardSubtitleProps {
  authorId: number;
  username: string;
  timeSinceDateCreated: string;
  timeSinceDateUpdated: string;
}

const CustomCardSubtitle = (props: CustomCardSubtitleProps) => {
  const {
    username,
    authorId,
    timeSinceDateCreated,
    timeSinceDateUpdated,
  } = props;
  return (
    <small className="d-flex">
      <div>
        {"Posted by "}
        <Link className="text-body font-weight-bold" to={"/users/" + authorId}>
          {username}
        </Link>
      </div>
      <div className="ml-1">{timeSinceDateCreated}</div>
      {timeSinceDateCreated !== timeSinceDateUpdated && (
        <div className="ml-1 font-italic">
          {"edited " + timeSinceDateUpdated}
        </div>
      )}
    </small>
  );
};

export default CustomCardSubtitle;
