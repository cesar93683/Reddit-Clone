import mongoose from "mongoose";
import { IUser } from "./user";

const Schema = mongoose.Schema;

export interface IPost extends mongoose.Document {
  title: string;
  description: string;
  numComments: number;
  creator: IUser["_id"];
  dateCreated: number;
  comments: [
    {
      comment: string;
      creatorUsername: string;
      creator: IUser["_id"];
      dateCreated: number;
    }
  ];
}

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  numComments: { type: Number, required: true },
  creatorUsername: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  dateCreated: { type: Number, required: true },
  comments: [
    {
      comment: { type: String, required: true },
      creatorUsername: { type: String, required: true },
      creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
      dateCreated: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<IPost>("Post", placeSchema);
