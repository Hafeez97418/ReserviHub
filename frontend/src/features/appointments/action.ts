import axios from "axios";
import { AsyncErrHandler, commonHTTPConfig } from "../../lib/utils";
import { Payment } from "../../lib/types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "";

const getAllAppointments = AsyncErrHandler(async () => {
  const res = await axios.get(
    BACKEND_URL + "/api/v1/appointment",
    commonHTTPConfig
  );
  return res.data;
});

const createAppointment = AsyncErrHandler(async (intervalId: string) => {
  const res = await axios.post(
    BACKEND_URL + "/api/v1/appointment/create/" + intervalId,
    {},
    commonHTTPConfig
  );
  return res.data;
});

const confirmAppointment = AsyncErrHandler(async (appointmentId: string) => {
  const res = await axios.get(
    BACKEND_URL + "/api/v1/appointment/confirm/" + appointmentId,
    commonHTTPConfig
  );
  return res.data;
});

const cancelAppointment = AsyncErrHandler(async (appointmentId: string) => {
  const res = await axios.post(
    BACKEND_URL + "/api/v1/appointment/cancel/" + appointmentId,
    {},
    commonHTTPConfig
  );
  return res.data;
});

const completeAppointment = AsyncErrHandler(async (appointmentId: string) => {
  const res = await axios.post(
    BACKEND_URL + "/api/v1/appointment/complete/" + appointmentId,
    {},
    commonHTTPConfig
  );
  return res.data;
});

const getPayments = AsyncErrHandler(async (appointmentId: string) => {
  const res = await axios.get(
    BACKEND_URL + "/api/v1/payments/",
    commonHTTPConfig
  );
  if (appointmentId && res.data?.payments) {
    return res.data.payments.find((payment: Payment) => {
      return payment.appointmentId === appointmentId;
    });
  }
  return res.data;
});

export {
  getAllAppointments,
  createAppointment,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  getPayments,
};
