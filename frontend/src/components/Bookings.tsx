import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CalendarClock } from "lucide-react";

const MyBookings = ({ appointments }: { appointments: any }) => {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {appointments.map((appointment: any) => (
                <Card key={appointment.id} className="w-full max-w-md shadow-xl rounded-2xl">
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
                        {appointment.status === "pending" || appointment.status === "confirmed" ? (
                            <div className="flex gap-2">
                                <Button variant="destructive">Cancel</Button>
                                <Button>Confirm</Button>
                            </div>
                        ) : null}
                        {appointment.status === "confirmed" ? (
                            <Button variant="secondary">Complete</Button>
                        ) : null}
                        {appointment.status === "pending" ? (<Button>
                            Pay
                        </Button>) : null}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default MyBookings;
