import {
  createBusiness,
  deleteBusiness,
  deleteBusinessImage,
  getAllBusinesses,
  getBusinessAnalytics,
  updateBusinessDetails,
  uploadBusinessImage,
} from "@/controllers/Business.js";
import { checkRole, isLoggedIn } from "@/middleware/common.js";
import { validateCredentials } from "@/middleware/credentials.js";
import express from "express";
import { body } from "express-validator";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

//validation
const businessValidation = [
  body("name")
    .isLength({ min: 1, max: 50 })
    .withMessage("name must be between 1 and 50 characters"),
  body("description")
    .notEmpty()
    .isString()
    .withMessage("description should not be empty"),
  body("category")
    .isLength({ min: 1, max: 50 })
    .withMessage("name must be between 1 and 50 characters"),
  body("location")
    .notEmpty()
    .isString()
    .withMessage("description should not be empty"),
];
//routes
const businessRouter = express.Router();
businessRouter
  .route("/business")
  .post(
    isLoggedIn,
    checkRole("user"),
    businessValidation,
    validateCredentials,
    createBusiness
  )
  .get(getAllBusinesses)
  .put(
    isLoggedIn,
    checkRole("manager"),
    businessValidation,
    validateCredentials,
    updateBusinessDetails
  )
  .delete(isLoggedIn, checkRole("manager"), deleteBusiness);

businessRouter
  .route("/image")
  .post(
    isLoggedIn,
    checkRole("manager"),
    upload.single("avatar"),
    uploadBusinessImage
  )
  .delete(isLoggedIn, checkRole("manager"), deleteBusinessImage);

businessRouter.get(
  "/analytics",
  isLoggedIn,
  checkRole("manager"),
  getBusinessAnalytics
);

export default businessRouter;

//security check 1 is completed
