import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  endpointNotImplemented,
  globalErrorHandler,
} from "@/middleware/errors.js";
import { authenticateDB } from "./repositories/connection.mysql.js";
import authRouter from "./routes/auth.routes.js";
import session from "express-session";
import UserRouter from "./routes/User.routes.js";
import businessRouter from "./routes/business.routes.js";
import reviewRouter from "./routes/review.routes.js";
import IntervalRouter from "./routes/interval.routes.js";
import AppointmentRouter from "./routes/Appointment.routes.js";
import { appointmentSideJobs } from "./utils/utils.js";
import paymentRouter from "./routes/payment.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string, // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 }, // Session expires in 10 minutes
  })
);
app.use(
  express.json({
    verify: (req, _, buf) => {
      // Provide access to the request raw body
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: false }));

/*------------- Security Config -------------*/
app.use(helmet());

/*------------- Endpoints -------------*/

app.use("/api/v1", authRouter);
app.use("/api/v1", UserRouter);
app.use("/api/v1", businessRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", IntervalRouter);
app.use("/api/v1", AppointmentRouter);
app.use("/api/v1", paymentRouter);

/*------------- Error middleware -------------*/

authenticateDB();
appointmentSideJobs();

app.use(endpointNotImplemented);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Service listening on port ${PORT}...`));
