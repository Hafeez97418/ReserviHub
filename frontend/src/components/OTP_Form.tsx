import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { useDispatch, useSelector } from "react-redux"
import { X } from "lucide-react";
import { toggleOTPForm } from "../features/ui/uiSlice";
import { DialogDescription, DialogFooter } from "./ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "./ui/input-otp"
import { Button } from "./ui/button";
import { useState } from "react";
import { register } from "../features/auth/action";
import { State } from "../lib/types";

function OTP_Form() {
    const otp_form = useSelector((state: State) => state.ui.otp_form);
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");
    const [alert, setAlert] = useState("this OTP is only valid for 10 minutes");
    const [btn, setBtn] = useState("submit");
    return (
        <Dialog open={otp_form}>
            <DialogContent className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center" >
                <div className="bg-white p-8 flex flex-col rounded-xl border-2 dark:bg-black dark:text-white gap-4">
                    <div className="flex justify-between items-center gap-8 w-full"><DialogTitle>verify email</DialogTitle>
                        <X onClick={() => {
                            dispatch(toggleOTPForm())
                        }} className="cursor-pointer" />
                    </div>
                    <DialogDescription>we just sent an otp to your email for verification</DialogDescription>
                    <InputOTP maxLength={6} onChangeCapture={(e: React.FormEvent<HTMLInputElement>) => {
                        setOtp(e.currentTarget.value);
                    }}>
                        <InputOTPGroup >
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className="flex gap-4">
                        <Button variant={"outline"} onClick={async (e) => {
                            e.preventDefault();
                            setBtn("Loading...")
                            const res = await register(otp);

                            if (res.success) {
                                setBtn("ok");
                                window.location.replace("/");
                            } else {
                                setBtn("submit")
                                setAlert(res.message);
                            }
                        }}>{btn}</Button>
                    </div>
                    <DialogFooter className="gap-0 text-sm sm:justify-start">
                        {alert}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default OTP_Form
