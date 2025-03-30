//@ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

export default async function Checkout(sessionId: string) {
  const cashfree = await load({
    mode: "sandbox",
  });
  const checkoutOptions = {
    paymentSessionId: sessionId,
    redirectTarget: "_self",
  };
  cashfree.checkout(checkoutOptions);
}
