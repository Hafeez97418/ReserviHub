import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url"; // Needed for __dirname in ES Modules

import {
  endpointNotImplemented,
  globalErrorHandler,
} from "./middleware/errors.js";
import { authenticateDB } from "./repositories/connection.mysql.js";
import authRouter from "./routes/auth.routes.js";
import UserRouter from "./routes/User.routes.js";
import businessRouter from "./routes/business.routes.js";
import reviewRouter from "./routes/review.routes.js";
import IntervalRouter from "./routes/interval.routes.js";
import AppointmentRouter from "./routes/Appointment.routes.js";
import { appointmentSideJobs } from "./utils/utils.js";
import paymentRouter from "./routes/payment.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

// Enable CORS only if FRONTEND_BASE_URL is set
if (process.env.FRONTEND_BASE_URL) {
  const cors = (await import("cors")).default;
  app.use(
    cors({
      origin: process.env.FRONTEND_BASE_URL,
      credentials: true,
    })
  );
}

// Configure Socket.io with CORS if FRONTEND_BASE_URL is set
export const io = new Server(server, {
  cors: process.env.FRONTEND_BASE_URL
    ? {
        origin: process.env.FRONTEND_BASE_URL,
        methods: ["GET", "POST"],
      }
    : undefined,
});

// Extend IncomingMessage to include rawBody
declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}

const frontendPath = path.resolve(__dirname, "../view");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"], // Allow everything
        scriptSrc: ["*"], // Allow all scripts
        imgSrc: ["*"], // Allow all images
      },
    },
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 }, // Session expires in 10 minutes
  })
);

app.use(
  express.json({
    verify: (req, _, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(frontendPath));

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("onIntervalPage", (intervalId) => {
    socket.join(intervalId);
    console.log("User joined interval:", intervalId);
  });

  socket.on("offIntervalPage", (intervalId) => {
    socket.leave(intervalId);
  });
});

/*------------- API Endpoints -------------*/
app.use("/api/v1", authRouter);
app.use("/api/v1", UserRouter);
app.use("/api/v1", businessRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", IntervalRouter);
app.use("/api/v1", AppointmentRouter);
app.use("/api/v1", paymentRouter);

// Serve React frontend for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

/*------------- Database & Background Jobs -------------*/
authenticateDB();
appointmentSideJobs();

/*------------- Error Handling Middleware -------------*/
app.use(endpointNotImplemented);
app.use(globalErrorHandler);

// Start the server
server.listen(PORT, () => {
  console.log(`Service listening on http://localhost:${PORT}`);
  console.log(
    `Frontend should be accessible at ${process.env.FRONTEND_BASE_URL}`
  );
});
