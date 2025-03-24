import { Cashfree, CreateOrderRequest } from "cashfree-pg";
import { Appointment,  Payment } from "@/models/database.js";
import axios from "axios";

// Cashfree API Configuration
Cashfree.XClientId = process.env.GATEWAY_CLIENT_ID;
Cashfree.XClientSecret = process.env.GATEWAY_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL;

/**
 * Creates an order using Cashfree API.
 */
async function createOrder(request: CreateOrderRequest) {
  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    return { success: true, response: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data || error.message,
    };
  }
}

/**
 * Verifies the payment status using Cashfree API.
 */
const verifyPayment = async (orderId: string) => {
  try {
    const response = await axios.get(
      `${GATEWAY_BASE_URL}/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.GATEWAY_CLIENT_ID,
          "x-client-secret": process.env.GATEWAY_SECRET,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, response: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data || error.message };
  }
};

/**
 * Processes a refund for an appointment.
 */
const processRefund = async (appointmentId: string) => {
  try {
    // Fetch the appointment and related payment
    const appointment = (await Appointment.findByPk(appointmentId)) as any;
    if (!appointment)
      return { success: false, message: "Appointment not found" };

    const payment = (await Payment.findOne({
      where: { appointmentId },
    })) as any;
    if (!payment)
      return { success: false, message: "Payment record not found" };

    if (appointment.status !== "confirmed") {
      return {
        success: false,
        message: "Refund not allowed for pending/canceled appointments",
      };
    }

    // Call Cashfree Refund API
    const orderId = payment.order.response.order_id;

    const response = await axios.get(
      `${GATEWAY_BASE_URL}/pg/orders/${orderId}/refunds`,
      {
        headers: {
          "x-client-id": process.env.GATEWAY_CLIENT_ID,
          "x-client-secret": process.env.GATEWAY_SECRET,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data[0].refund_status === "SUCCESS") {
      appointment.status = "cancelled";
      payment.status = "refunded";
      await appointment.save();
      await payment.save();
      return { success: true, message: "Refund processed successfully" };
    }

    return {
      success: false,
      message: "Refund request failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Refund failed",
      error: error.response?.data || error,
    };
  }
};





export { createOrder, verifyPayment, processRefund };
