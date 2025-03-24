import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarClock, ArrowRight } from "lucide-react";
const data = [
    {
        "id": "8867d5cf-2474-4622-96b8-184d0d9deb1b",
        "businessId": "02c68ded-b95a-4795-9544-ad82495b6228",
        "startTime": "09:00:00",
        "endTime": "10:00:00",
        "price": "200.00",
        "maxSlots": 50,
        "availableSlots": 48,
        "description": "haircut",

        "createdAt": "2025-03-23T17:26:52.000Z",
        "updatedAt": "2025-03-23T17:57:24.000Z"
    },
    {
        "id": "3fa9e441-544b-4f9e-ba4b-d125e8ffb80d",
        "businessId": "02c68ded-b95a-4795-9544-ad82495b6228",
        "startTime": "13:00:00",
        "endTime": "14:00:00",
        "price": "200.00",
        "maxSlots": 50,
        "availableSlots": 50,
        "description": "haircut",

        "createdAt": "2025-03-24T15:41:49.000Z",
        "updatedAt": "2025-03-24T15:41:49.000Z"
    }
]

const AppointmentCard = ({ appointment }: { appointment: any }) => {
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
                <Button className="w-full flex items-center justify-center gap-2">
                    Book Slot <ArrowRight size={16} />
                </Button>
            </CardContent>
        </Card>
    );
};

const AppointmentSlots = ({ businessId }: { businessId: string }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            {data.map((item) => (
                <AppointmentCard key={item.id} appointment={item} />
            ))}
        </div>
    );
};

export default AppointmentSlots;
