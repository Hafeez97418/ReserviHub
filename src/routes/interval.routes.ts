import {
  createAppointmentInterval,
  deleteAppointmentInterval,
  getAppointmentIntervals,
} from "@/controllers/Intervals.js";
import { checkRole, isLoggedIn } from "@/middleware/common.js";
import { validateCredentials } from "@/middleware/credentials.js";
import express from "express";
const IntervalRouter = express.Router();

import { body } from "express-validator";

export const validateAppointmentInterval = [
  body("type")
    .isIn(["daily", "hourly"])
    .withMessage("Type must be either 'daily' or 'hourly'"),
  body("startTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage("Invalid time format (HH:MM:SS)"),
  body("endTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage("Invalid time format (HH:MM:SS)"),
  body("maxSlots")
    .isInt({ min: 1 })
    .withMessage("maxSlots must be an integer greater than 0"),
  body("availableSlots")
    .isInt({ min: 0 })
    .withMessage("availableSlots must be a non-negative integer"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("bufferTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Buffer time must be a non-negative integer (seconds)"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be an integer (seconds)"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

IntervalRouter.post(
  "/appointment-interval",
  isLoggedIn,
  checkRole("manager"),
  validateAppointmentInterval,
  validateCredentials,
  createAppointmentInterval
);
IntervalRouter.get(
  "/appointment-interval/:businessId",
  getAppointmentIntervals
);

IntervalRouter.delete(
  "/appointment-interval/:intervalId",
  isLoggedIn,
  checkRole("manager"),
  deleteAppointmentInterval
);

export default IntervalRouter;
