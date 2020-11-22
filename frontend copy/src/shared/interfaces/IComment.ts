export default interface IComment {
  id: string;
  author: {
    id: number;
    username: string;
  };
  comment: string;
  dateCreated: number;
}
