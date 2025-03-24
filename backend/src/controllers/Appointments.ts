import Appointment from "@/models/Appointment.js";
import AppointmentInterval from "@/models/AppointmentInterval.js";
import Payment from "@/models/Payments.js";
import User from "@/models/User.js";
import {
  createOrder,
  processRefund,
  verifyPayment,
} from "@/repositories/paymentGateway.js";
import { RequestWithUser } from "@/types/types.js";
import { catchAsyncErrors } from "@/utils/errors/common.js";
import { sendEvent, updatePeakHours, updateRevenue } from "@/utils/utils.js";
import { Request, Response, NextFunction } from "express";


/**
 * create new appointment.
 */
const bookAppointment = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const { intervalId } = req.params;
    const { start }: { start: string | undefined } = req.body;

    let startDate: null | Date = null;
    if (!start) {
      startDate = new Date();
    } else {
      const userDate = new Date(start);
      if (userDate < new Date() || isNaN(userDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date" });
      }
      startDate = userDate;
    }

    const interval: any = await AppointmentInterval.findByPk(intervalId);
    if (!interval) {
      return res
        .status(404)
        .json({ success: false, message: "interval not found" });
    }

    if (interval.availableSlots === 0) {
      return res
        .status(400)
        .json({ success: false, message: "interval slot are booked" });
    }
    const user: any = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const AppointmentData: Partial<Record<any, any>> = {
      userId,
      intervalId,
      businessId: interval.businessId,
      status: "pending",
      startTime: interval.startTime,
      endTime: interval.endTime,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await updatePeakHours(interval.businessId, startDate);

    const appointment: any = await Appointment.create(AppointmentData);
    const order = await createOrder({
      order_amount: interval.price,
      order_currency: "INR",
      order_id: appointment.id,
      customer_details: {
        customer_id: user.id,
        customer_phone: user.phoneNumber,
        customer_name: user.name,
        customer_email: user.email,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_BASE_URL}/complete`,
      },
    });
    if (!order.success) {
      appointment.status = "failed";
      appointment.expiresAt = null;
      await appointment.save();
      return res
        .status(500)
        .json({ success: false, message: "appointment creation failed" });
    }
    const payment = await Payment.create({
      userId,
      appointmentId: appointment.id,
      amount: interval.price,
      status: "pending",
      order,
    });

    interval.availableSlots -= 1;
    sendEvent(intervalId, "new_appointment", {
      count: 1,
      available: interval.availableSlots,
    });
    if (interval.availableSlots === 0) {
      interval.booked = true;
    }
    interval.save();

    res.status(201).json({
      success: true,
      message: "appointment created",
      appointment,
      payment,
    });
  }
);
/**
 * get all appointments
 */
const getAppointments = catchAsyncErrors(
  async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    const { userId } = req.user;
    const { status, intervalId } = req.query;
    const query: Record<any, any> = { userId };
    if (status) query.status = status;
    if (intervalId) {
      delete query[userId];
      query.intervalId = intervalId;
    }
    const appointments = await Appointment.findAll({
      where: query, include: { model: Payment }
    });
    res.status(200).json({ success: true, appointments });
  }
);
/**
 * confirm  appointments manually.
 */
const confirmAppointment = catchAsyncErrors(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { appointmentId } = req.params;
    const { returnUrl } = req.query as { returnUrl: string | undefined };
    const appointment = (await Appointment.findByPk(appointmentId)) as any;

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `your appointment cannot be confirmed because it's status is ${appointment.status}`,
      });
    }
    const verification = await verifyPayment(appointmentId);
    if (!verification.success) {
      return res.status(500).json({
        success: false,
        message:
          "appointment confirmation failed for some reason please try again after some time",
      });
    }

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "reservation not found" });
    }
    const payment = (await Payment.findOne({
      where: { appointmentId },
    })) as any;

    if (verification.response.order_status === "PAID") {
      appointment.status = "confirmed";
      payment.status = "paid";
      appointment.expiresAt = null;
      await appointment.save(); // Ensure async operations are awaited
      await payment.save();

      if (returnUrl) {
        return res.redirect(returnUrl); // ✅ Prevents duplicate response
      }

      return res.status(200).json({ success: true, appointment, payment });
    }

    res.status(200).json({ success: true , appointment , payment});
  }
);
/**
 * Cancels an appointment.
 * Processes refund if payment was made.
 */
const cancelAppointment = catchAsyncErrors(
  async (req: RequestWithUser, res: Response) => {
    const { appointmentId } = req.params;
    const appointment = (await Appointment.findByPk(appointmentId)) as any;
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    if (
      appointment.status !== "pending" &&
      appointment.status !== "confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "your appointment cannot be cancelled",
      });
    }
    if (appointment.status === "pending") {
      appointment.status = "cancelled";
      await appointment.save();
    } else if (appointment.status === "confirmed") {
      const payment = (await Payment.findOne({
        where: { appointmentId },
      })) as any;
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "Payment record not found" });
      }
      const refund = await processRefund(appointmentId);
      if (refund.success) {
        payment.status = "refunded";
        appointment.status = "cancelled";
        await payment.save();
        await appointment.save();
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Refund process failed" });
      }
    }
    const interval = (await AppointmentInterval.findByPk(
      appointment.intervalId
    )) as any;
    if (interval) {
      interval.availableSlots += 1;
      sendEvent(interval.id, "failed_appointment", {
        count: 1,
        available: interval.availableSlots,
      });
      interval.booked = false;
      await interval.save();
    }
    res.status(200).json({ success: true, message: "Appointment cancelled" });
  }
);
/**
 * completes the appointments manually
 */
const completeAppointment = catchAsyncErrors(
  async (req: RequestWithUser, res: Response) => {
    const { appointmentId } = req.params;

    // Find appointment
    const appointment = (await Appointment.findByPk(appointmentId)) as any;
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Ensure the appointment is confirmed before marking it as completed
    if (appointment.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed appointments can be completed",
      });
    }
    // WARNING: Assuming payout is successful (not processing actual payouts)
    console.warn(
      "⚠️ WARNING: Payout is assumed to be successful. No actual payout processing is happening."
    );

    // Fake payout response (assuming success)
    const payout = { success: true };

    if (!payout.success) {
      return res
        .status(500)
        .json({ success: false, message: "Payout failed, try again later" });
    }

    // Mark appointment as completed
    appointment.status = "completed";

    // Update available slots
    const interval: any = await AppointmentInterval.findByPk(
      appointment.intervalId
    );
    interval.availableSlots += 1;
    sendEvent(interval.id, "completed_appointment", {
      count: 1,
      available: interval.availableSlots,
    });
    const result = await updateRevenue(
      interval.businessId,
      Number(interval.price)
    );
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "something went wrong please try again after some time",
      });
    }
    await interval.save();
    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment completed. ⚠️ WARNING: Payout is assumed to be successful.",
      appointment,
    });
  }
);

/**
 * automatic appointment updates by cashFree webHooks
 */

const webHookRequests = catchAsyncErrors(
  async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      const { order_id } = data.order;

      switch (req.body.type) {
        case "PAYMENT_SUCCESS_WEBHOOK":
          const appointment = (await Appointment.findByPk(order_id)) as any;
          if (!appointment || appointment.status !== "pending") break;

          const payment = (await Payment.findOne({
            where: { appointmentId: appointment.id },
          })) as any;

          if (!payment) break;

          appointment.status = "confirmed";
          payment.status = "paid";
          await Promise.all([payment.save(), appointment.save()]);
          break;

        case "PAYMENT_FAILED_WEBHOOK":
          const failedAppointment = (await Appointment.findByPk(
            order_id
          )) as any;
          if (!failedAppointment || failedAppointment.status !== "pending")
            break;

          const failedPayment = (await Payment.findOne({
            where: { appointmentId: failedAppointment.id },
          })) as any;

          if (failedPayment) {
            failedPayment.status = "failed";
            await failedPayment.save();
          }

          failedAppointment.status = "failed";
          await failedAppointment.save();

          if (failedAppointment.intervalId) {
            const interval = (await AppointmentInterval.findByPk(
              failedAppointment.intervalId
            )) as any;

            if (interval) {
              interval.availableSlots = Math.max(
                0,
                interval.availableSlots + 1
              );
               sendEvent(interval.id, "failed_appointment", {
                 count: 1,
                 available: interval.availableSlots,
               });
              interval.booked = false;
              await interval.save();
            }
          }
          break;

        default:
          break;
      }
      res
        .status(200)
        .json({ success: true, message: "Appointment status updated" });
    } catch (error) {
      console.error("Webhook error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

export {
  bookAppointment,
  getAppointments,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  webHookRequests,
};
