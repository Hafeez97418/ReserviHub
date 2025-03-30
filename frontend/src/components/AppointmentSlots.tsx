import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CalendarClock, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Interval } from "../lib/types";
import { useEffect, useState } from "react";
import { getSlotsForUsers } from "../features/slots/action";
import { LoadingBtn } from "./Buttons";
import { createAppointment } from "../features/appointments/action";
import { setMessage } from "../features/globalSlice";
import Checkout from "../lib/gateway";
import { TypographyH3 } from "./ui/typography";

const AppointmentCard = ({ appointment }: { appointment: Interval }) => {
    const [btn, setBtn] = useState(false);
    const dispatch = useDispatch();

    const handleOnBooking = async (intervalId: string) => {
        setBtn(true);
        const res = await createAppointment(intervalId);
        if (!res.success) {
            console.info(res);
            dispatch(setMessage("order creation failed"));
            return
        }
        const orderId: string | undefined = res?.payment?.order?.response?.payment_session_id;
        if (!orderId) {
            setBtn(false);
            return
        }
        Checkout(orderId)
        setBtn(false);
    }
    return (
        <Card className="w-full max-w-md shadow-xl rounded-2xl transition-transform hover:scale-105">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <CalendarClock className="text-primary" />
                    {appointment.description}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                    {appointment.startTime} - {appointment.endTime}
                </span>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span>Price: ${appointment.price}</span>
                    <span>Available: {appointment.availableSlots}/{appointment.maxSlots}</span>
                </div>
                <LoadingBtn className="w-full flex items-center justify-center gap-2" onClick={() => handleOnBooking(appointment.id)} isLoading={btn}>
                    Book Slot
                    <ArrowRight size={16} />
                </LoadingBtn>
            </CardContent>
        </Card>
    );
};

const AppointmentSlots = ({ businessId }: { businessId: string }) => {
    const { slots } = useSelector((state: { slot: { slots: Interval[] } }) => state.slot);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        getSlotsForUsers(businessId);
        setLoading(false);
    }, [businessId]);
    return (
        <div className="my-8">
            <TypographyH3>Appointment Slots</TypographyH3>
            {!loading && slots.length <= 0? <p>no slots found</p> : null}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 my-4">
                {slots.map((item) => (
                    <AppointmentCard key={item.id} appointment={item} />
                ))}
            </div>
        </div>
    );
};

export default AppointmentSlots;
