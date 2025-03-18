import { FormEvent } from "react";
import { getFormEntries } from "../../lib/utils";

function verifyEmail(e: FormEvent) {
  let data = new FormData(e.currentTarget as HTMLFormElement);
  e.preventDefault();
  data = getFormEntries(data);
  //api logic
  sessionStorage.setItem("user-details", JSON.stringify(data));
  return { success: true, data };
}

export { verifyEmail };
