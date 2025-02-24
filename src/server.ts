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


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}

app.use(cors());

app.use(cookieParser())
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

/*------------- Error middleware -------------*/
authenticateDB();

app.use(endpointNotImplemented);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Service listening on port ${PORT}...`));
