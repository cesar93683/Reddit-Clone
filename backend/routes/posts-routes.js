const express = require("express");
const { check } = require("express-validator");

const postsControllers = require("../controllers/posts-controllers");
const checkAuth = require("../middleware/check-auth");

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

module.exports = router;
