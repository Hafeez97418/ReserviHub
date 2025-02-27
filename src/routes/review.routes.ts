import {
  createRating,
  removeRating,
  showAllRatings,
  showRatings,
  updateRating,
} from "@/controllers/Review.js";
import { isLoggedIn } from "@/middleware/common.js";
import { validateCredentials } from "@/middleware/credentials.js";
import { Router } from "express";
import { body } from "express-validator";
const reviewRouter = Router();

const reviewValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  body("review").notEmpty().withMessage("review is required"),
];
reviewRouter
  .route("/review/:id")
  .post(isLoggedIn, reviewValidation, validateCredentials, createRating)
  .get(isLoggedIn, showRatings)
  .put(isLoggedIn, reviewValidation, validateCredentials, updateRating)
  .delete(isLoggedIn, removeRating);

reviewRouter.get("/review/all/:id", showAllRatings);

export default reviewRouter;
