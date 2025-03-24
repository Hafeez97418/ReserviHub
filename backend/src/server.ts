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
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();
const server = createServer(app);
const corsOptions = {
  origin: "http://localhost:5173", // must match your frontend URL exactly
  credentials: true, // allow cookies, auth headers, etc.
};
export const io = new Server(server, {
  cors: {
    origin: "*", // Change this for security in production
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}

app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
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
io.on("connection", (socket) => {
  //user on interval page
  socket.on("onIntervalPage", (intervalId) => {
    socket.join(intervalId);
    console.log("user joined to:-", intervalId);
    
  });

  //from multiple uses a single user leaves interval page
  socket.on("offIntervalPage", (intervalId) => {
    socket.leave(intervalId);
  });
});

/*------------- Security Config -------------*/
app.use(helmet());

/*--------------IO connections ---------------*/

/*------------- Endpoints -------------*/

app.use("/api/v1", authRouter);
app.use("/api/v1", UserRouter);
app.use("/api/v1", businessRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", IntervalRouter);
app.use("/api/v1", AppointmentRouter);
app.use("/api/v1", paymentRouter);
app.get("/test", (_req, res) => {
  io.emit("test", { message: "hello" });
  res.status(200).json({ success: true, message: "connection is made" });
});
/*------------- Error middleware -------------*/

authenticateDB();
appointmentSideJobs();

app.use(endpointNotImplemented);
app.use(globalErrorHandler);

server.listen(PORT, () => console.log(`Service listening on port ${PORT}...`));
