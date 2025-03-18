import { Payment, User } from "@/models/database.js";
import { RequestWithUser } from "@/types/types.js";
import { catchAsyncErrors } from "@/utils/errors/common.js";
import {  Response, NextFunction } from "express";

const getAllPayments = catchAsyncErrors(async (req: RequestWithUser, res: Response , _next:NextFunction) => {
    const { userId } = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(200).json({success: false, message: "user not found"});
    }
    const payments = await Payment.findAll({ where: { userId } });
    res.status(200).json({ success: true, payments });
});


export { getAllPayments };