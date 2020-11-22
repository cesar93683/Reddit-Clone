import IComment from "./IComment";

export default interface IPost {
  id: string;
  title: string;
  creatorUsername: string;
  creator: string;
  description: string;
  numComments: number;
  dateCreated: number;
  comments: IComment[];
}
