import {
  Login,
  Logout,
  Register,
  sendEmailVerification,
} from "@/controllers/auth.js";
import { body, ValidationChain } from "express-validator";
import express from "express";
import { validateCredentials } from "@/middleware/credentials.js";

const authRouter = express.Router();

const userValidation: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters"),

  body("email").trim().isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits"),
];

authRouter.post(
  "/verify-email",
  userValidation,
  validateCredentials,
  sendEmailVerification
);
authRouter.post(
  "/register",
  userValidation.concat(
    body("otp").notEmpty().isNumeric().withMessage("invalid OTP")
  ),
  validateCredentials,
  Register
);

authRouter.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Invalid email format"),

    body("password")
      .isLength({ min: 8, max: 50 })
      .withMessage("Password must be between 8 and 50 characters"),
  ],
  validateCredentials,
  Login
);

authRouter.post("/logout", Logout);


export default authRouter;
