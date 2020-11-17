import express from "express";
import { check } from "express-validator";

import postsControllers from "../controllers/posts-controllers";
import checkAuth from "../middleware/check-auth";

const router = express.Router();

router.get("/", postsControllers.getPosts);

router.get("/:pid", postsControllers.getPostById);

router.get("/user/:uid", postsControllers.getPostsByUserId);

router.use(checkAuth);

router.post("/", [check("title").not().isEmpty()], postsControllers.createPost);

router.patch("/:pid", postsControllers.updatePost);

router.post(
  "/:pid/newcomment",
  [check("comment").not().isEmpty()],
  postsControllers.newComment
);

router.delete("/:pid", postsControllers.deletePost);

export default router;
