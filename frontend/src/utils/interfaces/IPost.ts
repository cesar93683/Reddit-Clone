import IComment from "./IComment";

export default interface IPost {
  id: number;
  title: string;
  author: {
    id: number;
    username: string;
  };
  content: string;
  comments: IComment[];
  numComments: number;
  numVotes: number;
  dateCreated: number;
  dateUpdated: number;
}
