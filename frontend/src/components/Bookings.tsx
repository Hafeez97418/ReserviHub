import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CalendarClock } from "lucide-react";
import { Appointment } from "../lib/types";
import { TypographyH1 } from "./ui/typography";
import { Link } from "react-router-dom";
import { useState } from "react";
import { LoadingBtn } from "./Buttons";
import { cancelAppointment, completeAppointment, getPayments } from "../features/appointments/action";
import { useDispatch } from "react-redux";
import { setAlertMessage, setMessage } from "../features/globalSlice";
import Checkout from "../lib/gateway";


const MyBookings = ({ appointments }: { appointments: Appointment[] | undefined }) => {
    const [btnState, setBtnState] = useState(false);
    const dispatch = useDispatch();
    const [list, setList] = useState(appointments);
    const handleOnCancel = async (appointmentId: string) => {
        setBtnState(true);
        const res = await cancelAppointment(appointmentId);
        if (res.success) {
            dispatch(setAlertMessage(res.message));
            const temp = list?.filter((appointment) => {
                if (appointmentId === appointment.id) {
                    appointment.status = "cancelled";
                }
                return appointment
            })
            setList(temp);
        }
        setBtnState(false);
    }
    const handleOnComplete = async (appointmentId: string) => {
        setBtnState(true);
        const res = await completeAppointment(appointmentId);
        if (res.success) {
            dispatch(setAlertMessage(res.message));
            const temp = list?.filter((appointment) => {
                if (appointmentId === appointment.id) {
                    appointment.status = "completed";
                }
                return appointment
            })
            setList(temp);
        }
        setBtnState(false);
    }
    
    const handleOnBooking = async (appointmentId: string) => {
        setBtnState(true);
        const payment = await getPayments(appointmentId);
        
        if (!payment) {
            setMessage("payment not found");
            return
        }
        const orderId: string | undefined = payment?.order?.response?.payment_session_id;
        if (!orderId) {
            setBtnState(false);
            return
        }
        Checkout(orderId)
        setBtnState(false);
    }
    return (appointments && appointments.length > 0 ?
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {list?.map((appointment: Appointment) => (
                <Card key={appointment.id} className="w-full shadow-xl rounded-2xl">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <CalendarClock className="text-primary" />
                            {appointment.startTime} - {appointment.endTime}
                        </CardTitle>
                        <Badge variant="outline" className="capitalize">
                            {appointment.status}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm">
                            <p>Amount: ₹{appointment.Payment.amount}</p>
                            <p>Payment Status: {appointment.Payment.status}</p>
                            <p>Customer: {appointment.Payment.order.response.customer_details.customer_name}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {appointment.status === "pending" || appointment.status === "confirmed" ? (
                                <>
                                    <LoadingBtn
                                        isLoading={btnState}
                                        variant="destructive"
                                        onClick={() => {
                                            handleOnCancel(appointment.id)
                                        }}>
                                        Cancel
                                    </LoadingBtn>
                                    <Link to={`/confirm/${appointment.id}`}>
                                        <Button>Confirm</Button>
                                    </Link>
                                </>
                            ) : null}
                            {appointment.status === "confirmed" ? (
                                <LoadingBtn
                                    variant="secondary"
                                    onClick={() => {
                                        handleOnComplete(appointment.id);
                                    }} isLoading={btnState}>Complete</LoadingBtn>
                            ) : null}
                            {appointment.status === "pending" ? (<LoadingBtn
                                isLoading={btnState}
                                onClick={() => {
                                    handleOnBooking(appointment.id)
                                }}>
                                Pay
                            </LoadingBtn>) : null}
                            {appointment.status === "failed" || appointment.status === "cancelled" ? <Link to={`/confirm/${appointment.id}`}><Button>Confirm</Button></Link> : null}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div> : <TypographyH1>No Bookings found</TypographyH1>
    );
};

export default MyBookings;
