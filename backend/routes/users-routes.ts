import express from "express";
import { check } from "express-validator";

import usersController from "../controllers/users-controllers";

const router = express.Router();

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

export default router;
