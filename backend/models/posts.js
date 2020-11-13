const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  numComments: { type: Number, required: true },
  creatorUsername: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  comments: [
    {
      comment: { type: String, required: true },
      creatorUsername: { type: String, required: true },
      creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    },
  ],
});

module.exports = mongoose.model("Post", placeSchema);
