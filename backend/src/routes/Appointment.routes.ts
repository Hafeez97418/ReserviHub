import {
  bookAppointment,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  getAppointments,
  webHookRequests,
} from "@/controllers/Appointments.js";
import { isLoggedIn } from "@/middleware/common.js";
import express from "express";

const AppointmentRouter = express.Router();

AppointmentRouter.get("/appointment", isLoggedIn, getAppointments);
AppointmentRouter.post("/webhook", webHookRequests);

AppointmentRouter.post(
  "/appointment/create/:intervalId",
  isLoggedIn,
  bookAppointment
);

AppointmentRouter.post(
  "/appointment/cancel/:appointmentId",
  isLoggedIn,
  cancelAppointment
);

AppointmentRouter.post(
  "/appointment/complete/:appointmentId",
  isLoggedIn,
  completeAppointment
);

AppointmentRouter.get(
  "/appointment/confirm/:appointmentId",
  isLoggedIn,
  confirmAppointment
);

export default AppointmentRouter;
