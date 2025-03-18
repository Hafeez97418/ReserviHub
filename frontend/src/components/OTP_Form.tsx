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

function OTP_Form() {
    const otp_form = useSelector((state: any) => state.ui.otp_form);
    const dispatch = useDispatch();
    const [otp, setOtp] = useState();
    console.log(otp);
    
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
                    <InputOTP maxLength={6} onChangeCapture={(e: any) => {
                        setOtp(e.target.value)
                    }}>
                        <InputOTPGroup>
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
                        <Button variant={"outline"}>submit</Button>
                        <Button variant={"outline"}>cancel</Button>
                    </div>
                    <DialogFooter className="gap-0 text-sm sm:justify-start">this OTP is only valid for 10 minutes</DialogFooter>
                </div>
            </DialogContent>
        </Dialog>


    )
}

export default OTP_Form
