import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarClock, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import {  Interval } from "../lib/types";
import { useEffect } from "react";
import { getSlotsForUsers } from "../features/slots/action";

const AppointmentCard = ({ appointment }: { appointment:Interval }) => {
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
                <Button className="w-full flex items-center justify-center gap-2" onClick={() => {
                    // Checkout("payment-session-id") todo 

                }}>
                    Book Slot <ArrowRight size={16} />
                </Button>
            </CardContent>
        </Card>
    );
};

const AppointmentSlots = ({ businessId }: { businessId: string }) => {
    const { slots } = useSelector((state: { slot: { slots: Interval[] } }) => state.slot);
    useEffect(() => {
        getSlotsForUsers(businessId); 

    },[])
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            {slots.map((item) => (
                <AppointmentCard key={item.id} appointment={item} />
            ))}
        </div>
    );
};

export default AppointmentSlots;
