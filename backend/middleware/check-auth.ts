import jwt from "jsonwebtoken";
import HttpError from "../models/http-error";
import express from "express";

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: (<{ userId: string }>decodedToken).userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
