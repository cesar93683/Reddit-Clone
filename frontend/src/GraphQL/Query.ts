import { gql } from "@apollo/client";

const GET_ALL_POSTS_QUERY = gql`
  query {
    getAllPosts {
      id
      title
      dateCreated
      dateUpdated
      numComments
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
      dateCreated
      dateUpdated
      numComments
      author {
        id
        username
      }
      comments {
        id
        content
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
        dateCreated
        dateUpdated
        numComments
        author {
          id
          username
        }
      }
    }
  }
`;

export { GET_ALL_POSTS_QUERY, GET_POST_BY_ID_QUERY, GET_USER_QUERY };
