import { FormEvent } from "react";
import {
  AsyncErrHandler,
  commonHTTPConfig,
  getFormEntries,
} from "../../lib/utils";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

async function verifyEmail(e: FormEvent) {
  let data = new FormData(e.currentTarget as HTMLFormElement);
  e.preventDefault();
  data = getFormEntries(data);
  let res = null;
  try {
    if (!BACKEND_URL) {
      return { success: false, message: "backend url is not specified" };
    }
    res = await axios.post(
      BACKEND_URL + "/api/v1/verify-email",
      data,
      commonHTTPConfig
    );
  } catch (error: any) {
    if (error.response.data) {
      return { success: false, message: error.response.data.message };
    }
    return { success: false, message: error.message };
  }
  sessionStorage.setItem("user-details", JSON.stringify(data));
  return { success: true, res };
}

async function register(otp: string) {
  try {
    let userDetails = JSON.parse(
      sessionStorage.getItem("user-details") as string
    );

    if (!userDetails) {
      return {
        success: false,
        message: "something went wrong please try again later",
      };
    }
    const payload = {
      ...userDetails,
      otp: Number(otp),
    };
    console.log(payload);

    const res = await axios.post(
      BACKEND_URL + "/api/v1/register",
      payload,
      commonHTTPConfig
    );

    return { success: true, message: res.data.message };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.message };
    }
    return { success: false, message: error.message };
  }
}

async function login({ email, password }: Record<any, string>) {
  try {
    const res = await axios.post(
      BACKEND_URL + "/api/v1/login",
      { email, password },
      commonHTTPConfig
    );
    return { success: true, message: res.data.message };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.message };
    }
    return { success: false, message: error.message };
  }
}
const authenticateMe = AsyncErrHandler(async () => {
  const res = await axios.get(BACKEND_URL + "/api/v1/auth", {
    ...commonHTTPConfig,
    validateStatus: function (status) {
      if (status === 401 || status === 200) {
        return true;
      }
      return false;
    },
  });
  return res.data;
});

async function logout() {
  try {
    const res = await axios.post(
      BACKEND_URL + "/api/v1/logout",
      {},
      commonHTTPConfig
    );
    if (res.data.success) {
      window.location.replace("/");
    }
  } catch (err) {
    return;
  }
}
export { verifyEmail, register, login, authenticateMe, logout };
