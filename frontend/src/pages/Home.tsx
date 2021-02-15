import { gql } from "@apollo/client";
import React, { useState } from "react";
import Posts from "../components/Posts";
import SortDropDown from "../components/SortDropDown";

export const POSTS_BY_DATE_CREATED_QUERY = gql`
  query($cursor: Int) {
    posts(cursor: $cursor, limit: 10, by: "dateCreated") {
      posts {
        id
        title
        numComments
        numVotes
        dateCreated
        dateUpdated
        author {
          id
          username
        }
      }
      cursor
      hasMore
    }
  }
`;

export const POSTS_BY_NUM_VOTES_QUERY = gql`
  query($cursor: Int) {
    posts(cursor: $cursor, limit: 10, by: "numVotes") {
      posts {
        id
        title
        numComments
        numVotes
        dateCreated
        dateUpdated
        author {
          id
          username
        }
      }
      cursor
      hasMore
    }
  }
`;

export default function Home() {
  const currentDate = Date.now();
  const [votesActive, setVotesActive] = useState(false);
  const [datePostedActive, setDatePostedActive] = useState(true);

  const onSortByVotes = () => {
    setVotesActive(true);
    setDatePostedActive(false);
  };

  const onSortByDatePosted = () => {
    setVotesActive(false);
    setDatePostedActive(true);
  };

  return (
    <div>
      <SortDropDown
        onSortByVotes={onSortByVotes}
        votesActive={votesActive}
        onSortByDatePosted={onSortByDatePosted}
        datePostedActive={datePostedActive}
      />
      <Posts
        currentDate={currentDate}
        query={
          datePostedActive
            ? POSTS_BY_DATE_CREATED_QUERY
            : POSTS_BY_NUM_VOTES_QUERY
        }
      />
    </div>
  );
}
