import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { IPost } from "./posts";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  posts: [IPost["_id"]];
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  posts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Post" }],
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>("User", userSchema);
