import { validationResult } from "express-validator";
import mongoose from "mongoose";

import HttpError from "../models/http-error";
import Post, { IPost } from "../models/posts";
import User from "../models/user";
import express from "express";

const getPosts = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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

const getPostById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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

const getPostsByUserId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId).populate("posts");
  } catch (err) {
    const error = new HttpError(
      "Fetching posts failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!user || <number>user.posts.length === 0) {
    return next(
      new HttpError("Could not find posts for the provided user id.", 404)
    );
  }

  res.json({
    posts: user.posts.map((post) => post.toObject({ getters: true })),
  });
};

const createPost = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
    numComments: 0,
    creator: req.userData.userId,
    creatorUsername: user.username,
    dateCreated: Date.now(),
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

const updatePost = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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

const deletePost = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
    const session = await mongoose.startSession();
    session.startTransaction();
    Post.deleteOne;
    await Post.findByIdAndRemove(postId, { session: session });
    post.creator.posts.pull(post);
    await post.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted post." });
};

const newComment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
    creator: req.userData.userId,
    creatorUsername: user.username,
    dateCreated: Date.now(),
  });
  post.numComments = post.numComments + 1;

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

export default {
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  getPosts,
  newComment,
};
