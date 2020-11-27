import { gql } from "@apollo/client";

const POSTS_QUERY = gql`
  query {
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
  }
`;

const POST_QUERY = gql`
  query($id: Int!) {
    post(id: $id) {
      id
      title
      content
      numComments
      numVotes
      dateCreated
      dateUpdated
      author {
        id
        username
      }
      comments {
        id
        content
        numVotes
        dateCreated
        dateUpdated
        author {
          id
          username
        }
      }
    }
  }
`;
const USER_QUERY = gql`
  query($userId: Int!) {
    user(userId: $userId) {
      id
      username
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
    }
  }
`;
const POST_VOTE_QUERY = gql`
  query($postId: Int!) {
    postVote(postId: $postId) {
      value
    }
  }
`;
const COMMENT_VOTE_QUERY = gql`
  query($commentId: Int!) {
    commentVote(commentId: $commentId) {
      value
    }
  }
`;

export {
  POSTS_QUERY,
  POST_QUERY,
  USER_QUERY,
  POST_VOTE_QUERY,
  COMMENT_VOTE_QUERY,
};
