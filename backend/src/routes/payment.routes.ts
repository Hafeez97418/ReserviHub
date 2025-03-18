import { getAllPayments } from "@/controllers/Payments.js";
import { isLoggedIn } from "@/middleware/common.js";
import {Router} from "express";

const paymentRouter = Router();

paymentRouter.get("/payments", isLoggedIn, getAllPayments);

export default paymentRouter;