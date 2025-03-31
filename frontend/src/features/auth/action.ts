import { FormEvent } from "react";
import {
  AsyncErrHandler,
  commonHTTPConfig,
  getFormEntries,
} from "../../lib/utils";
import axios, { AxiosError } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL  ??  "";

async function verifyEmail(e: FormEvent) {
  const  raw_data = new FormData(e.currentTarget as HTMLFormElement);
  e.preventDefault();
  const data = getFormEntries(raw_data);
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
  } catch (error: unknown) {
       if (error instanceof AxiosError && error.response?.data) {
         return { success: false, message: error.response.data.message };
       }
       if (error instanceof Error) {
         return { success: false, message: error.message };
       }
       return { success: false, message: "An unknown error occurred" };
  }
  sessionStorage.setItem("user-details", JSON.stringify(data));
  return { success: true, res };
}

async function register(otp: string) {
  try {
   const userDetails = JSON.parse(
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
    const res = await axios.post(
      BACKEND_URL + "/api/v1/register",
      payload,
      commonHTTPConfig
    );

    return { success: true, message: res.data.message };
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return { success: false, message: error.response.data.message };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

async function login({ email, password }: Record<string, string>) {
  try {
    const res = await axios.post(
      BACKEND_URL + "/api/v1/login",
      { email, password },
      commonHTTPConfig
    );
    return { success: true, message: res.data.message };
  } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        return { success: false, message: error.response.data.message };
      }
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: "An unknown error occurred" };
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

const logout = AsyncErrHandler(async () => {
    const res = await axios.post(
      BACKEND_URL + "/api/v1/logout",
      {},
      commonHTTPConfig
    );
    return res;
});
export { verifyEmail, register, login, authenticateMe, logout };
