import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation logIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      userId
      error
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      userId
      error
    }
  }
`;

const EDIT_POST_MUTATION = gql`
  mutation($id: Int!, $content: String!) {
    editPost(id: $id, content: $content) {
      id
    }
  }
`;

const NEW_POST_MUTATION = gql`
  mutation($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation($postId: Int!, $content: String!) {
    createComment(postId: $postId, content: $content) {
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
`;

const DELETE_POST_MUTATION = gql`
  mutation($id: Int!) {
    deletePost(id: $id) {
      message
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation($id: Int!, $postId: Int!) {
    deleteComment(id: $id, postId: $postId) {
      message
    }
  }
`;

const EDIT_COMMENT_MUTATION = gql`
  mutation($id: Int!, $content: String!) {
    editComment(id: $id, content: $content) {
      id
    }
  }
`;

const VOTE_POST_MUTATION = gql`
  mutation($postId: Int!, $value: Int!) {
    votePost(postId: $postId, value: $value) {
      message
    }
  }
`;

const VOTE_COMMENT_MUTATION = gql`
  mutation($commentId: Int!, $value: Int!) {
    voteComment(commentId: $commentId, value: $value) {
      message
    }
  }
`;

export {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  EDIT_POST_MUTATION,
  NEW_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
  EDIT_COMMENT_MUTATION,
  VOTE_POST_MUTATION,
  VOTE_COMMENT_MUTATION,
};
