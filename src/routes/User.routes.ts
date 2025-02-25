import { deleteUser, getAllUsers, updateUser } from "@/controllers/Users.js";
import { isLoggedIn } from "@/middleware/common.js";
import { validateCredentials } from "@/middleware/credentials.js";
import express from "express";
import { body } from "express-validator";
const UserRouter = express.Router();

UserRouter.route("/user")
  .get(isLoggedIn, getAllUsers)
  .put(
    [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 1, max: 50 })
        .withMessage("Name must be between 1 and 50 characters"),
      body("email").trim().isEmail().withMessage("Invalid email format"),
      body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be exactly 10 digits"),
    ],
    validateCredentials,
    isLoggedIn,
    updateUser
  );

UserRouter.delete("/user/:id", isLoggedIn, deleteUser);

export default UserRouter;
