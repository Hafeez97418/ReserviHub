import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CalendarClock } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
}

interface Payment {
    id: string;
    status: string;
    amount: string;
}

interface Appointment {
    id: string;
    status: string;
    startTime: string;
    endTime: string;
    User: User;
    Payment: Payment;
}

interface LeadsProps {
    leads: Appointment[];
}

const LeadsComponent: React.FC<LeadsProps> = ({ leads }) => {
    const filteredAppointments = leads.filter(
        (appointment) => appointment.status !== "failed" && appointment.status !== "cancelled"
    );

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredAppointments.map((appointment) => (
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
                            <p>Customer: {appointment.User.name}</p>
                            <p>Email: {appointment.User.email}</p>
                            <p>Phone: {appointment.User.phoneNumber}</p>
                            <p>Amount: ₹{appointment.Payment.amount}</p>
                            <p>Payment Status: {appointment.Payment.status}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default LeadsComponent;
