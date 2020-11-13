const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Post = require("../models/posts");
const User = require("../models/user");

const getPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find({}, "-comments -description");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a post.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "Could not find post for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ post: post.toObject({ getters: true }) });
};

const getPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPosts;
  try {
    userWithPosts = await User.findById(userId).populate("posts");
  } catch (err) {
    const error = new HttpError(
      "Fetching posts failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithPosts || userWithPosts.posts.length === 0) {
    return next(
      new HttpError("Could not find posts for the provided user id.", 404)
    );
  }

  res.json({
    posts: userWithPosts.posts.map((post) => post.toObject({ getters: true })),
  });
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating post failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  const { title, description } = req.body;

  const createdPost = new Post({
    title,
    description,
    votes: 0,
    numComments: 0,
    creator: req.userData.userId,
    creatorUsername: user.username,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating post failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ post: createdPost });
};

const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { description } = req.body;
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update post.",
      500
    );
    return next(error);
  }

  if (post.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this post.", 401);
    return next(error);
  }

  post.description = description;

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update post.",
      500
    );
    return next(error);
  }

  res.status(200).json({ post: post.toObject({ getters: true }) });
};

const deletePost = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("Could not find post for this id.", 404);
    return next(error);
  }

  if (post.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this post.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await post.remove({ session: sess });
    post.creator.posts.pull(post);
    await post.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted post." });
};

const newComment = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a post.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "Could not find post for the provided id.",
      404
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating post failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  post.comments.push({
    comment: req.body.comment,
    votes: 0,
    creator: req.userData.userId,
    creatorUsername: user.username,
  });

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      "Creating comment failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Comment added." });
};

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPosts = getPosts;
exports.newComment = newComment;
