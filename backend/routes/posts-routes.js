const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/posts-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", placesControllers.getPosts);

router.get("/:pid", placesControllers.getPostById);

router.get("/user/:uid", placesControllers.getPostsByUserId);

router.use(checkAuth);

router.post(
  "/",
  [check("title").not().isEmpty()],
  placesControllers.createPost
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty()],
  placesControllers.updatePost
);

router.delete("/:pid", placesControllers.deletePost);

module.exports = router;
