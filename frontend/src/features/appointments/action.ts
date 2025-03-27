import axios from "axios";
import { AsyncErrHandler, commonHTTPConfig } from "../../lib/utils";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAllAppointments = AsyncErrHandler(async () => {
  const res = await axios.get(BACKEND_URL + "/api/v1/appointment", commonHTTPConfig);
  return res.data;
});

export { getAllAppointments };
