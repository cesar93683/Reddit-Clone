export default interface IComment {
  id: string;
  author: {
    id: number;
    username: string;
  };
  content: string;
  dateCreated: number;
}
