import { gql } from "@apollo/client";

const GET_ALL_POSTS_QUERY = gql`
  query {
    getAllPosts {
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

const GET_POST_BY_ID_QUERY = gql`
  query($id: Int!) {
    getPostById(id: $id) {
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
const GET_USER_QUERY = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
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
const GET_POST_VOTE_QUERY = gql`
  query($postId: Int!) {
    getPostVote(postId: $postId) {
      value
    }
  }
`;
const GET_COMMENT_VOTE_QUERY = gql`
  query($commentId: Int!) {
    getCommentVote(commentId: $commentId) {
      value
    }
  }
`;

export {
  GET_ALL_POSTS_QUERY,
  GET_POST_BY_ID_QUERY,
  GET_USER_QUERY,
  GET_POST_VOTE_QUERY,
  GET_COMMENT_VOTE_QUERY,
};
