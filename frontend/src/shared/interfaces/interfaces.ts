export interface PostInterface {
  id:string,
  title: string,
  creatorUsername: string,
  creator: string,
  description: string,
  numComments: number,
  dateCreated:number,
  comments: CommentInterface[]
}
export interface CommentInterface {
  id:string,
  creator:string,
  creatorUsername:string,
  comment: string,
  dateCreated: number,
}