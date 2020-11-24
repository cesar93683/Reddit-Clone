import IComment from "./IComment";

export default interface IPost {
  id: string;
  title: string;
  author: {
    id: number;
    username: string;
  };
  content: string;
  numComments: number;
  dateCreated: number;
  comments: IComment[];
}
