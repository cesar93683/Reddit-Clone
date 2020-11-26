import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation logIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        id
      }
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
      dateCreated
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
export {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  EDIT_POST_MUTATION,
  NEW_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
};
