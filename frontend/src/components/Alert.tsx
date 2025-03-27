import { AlertCircle, Info, X } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "./ui/alert"
import { useDispatch, useSelector } from "react-redux"
import { setAlertMessage, setMessage } from "../features/globalSlice";

export function ErrorAlert() {
    const { errMsg, showErr  } = useSelector((state: any) => state.global)
    const dispatch = useDispatch();

    return (
        <Alert variant="destructive" className={`${showErr ? "" : "hidden"} fixed md:w-1/2 bottom-10 right-2 z-50`}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between">
                {errMsg}
                <button onClick={() => {
                    dispatch(setMessage(""))
                }}> <X /> </button>
            </AlertDescription>
            
        </Alert>
    )
}

export function NormalAlert() {
    const { Msg, showAlert} = useSelector((state: any) => state.global)
    const dispatch = useDispatch();

    return (
        <Alert variant="default" className={`${showAlert ? "" : "hidden"} fixed md:w-1/2 bottom-10 right-2 z-50`}>
            <Info className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription className="flex justify-between">
                {Msg}
                <button onClick={() => {
                    dispatch(setAlertMessage(""))
                }}> <X /> </button>
            </AlertDescription>
        </Alert>
    )
}
