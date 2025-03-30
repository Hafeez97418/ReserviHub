import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import store from "../app/store";
import { setMessage } from "../features/globalSlice";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function HandleDarkMode(enabled?: boolean) {
  const html = document.documentElement;
  switch (enabled) {
    case undefined:
      const theme = localStorage.getItem("theme");
      if (!theme) {
        localStorage.setItem("theme", "light");
        html.classList.add("light");
      } else {
        html.classList.toggle(theme);
      }
      break;
    case true:
      localStorage.setItem("theme", "dark");
      html.classList.remove("light");
      html.classList.add("dark");
      break;
    default:
      localStorage.setItem("theme", "light");
      html.classList.remove("dark");
      html.classList.add("light");
      break;
  }
}

export function getFormEntries(data: FormData) {
  const obj: Record<string, string | File> = {};
  for (const [key, value] of data.entries()) {
    obj[key] = value;
  }
  return obj;
}

export const commonHTTPConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const AsyncErrHandler = <T extends (...args: any[]) => Promise<any>>(
  func: T
) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    try {
      const res = await func(...args);
      return res;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const res = error?.response?.data;
        if (res.errors) {
          store.dispatch(setMessage(res.errors));
        } else {
          store.dispatch(setMessage(res.message));
        }
        return res;
      }
      if (error instanceof Error) {
        store.dispatch(setMessage(error.message));
        return error as any
      }
      store.dispatch(setMessage("oops something went wrong"))
      return error as any
    }
  };
};
