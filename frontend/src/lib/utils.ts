import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const obj: any = {};
  for (const [key, value] of data.entries()) {
    obj[key] = value;
  }
  return obj;
}
