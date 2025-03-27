//@ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

export default async function Checkout(sessionId: string) {
  let cashfree = await load({
    mode: "sandbox",
  });
  let checkoutOptions = {
    paymentSessionId: sessionId,
    redirectTarget: "_self",
  };
  cashfree.checkout(checkoutOptions);
}
