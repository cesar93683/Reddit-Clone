import CommentInterface from "./CommentInterface";

export default interface PostInterface {
  id: string;
  title: string;
  creatorUsername: string;
  creator: string;
  description: string;
  numComments: number;
  dateCreated: number;
  comments: CommentInterface[];
}
