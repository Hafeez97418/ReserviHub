import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart2, Bot, CalendarCheck2,  DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardStats = () => {
    const data = {
        totalAppointments: 7,
        completedAppointments: 5,
        missedAppointments: 2,
        totalRevenue: "1000.00",
        peakHours: [],
        createdAt: "2025-03-21T14:31:46.000Z",
        updatedAt: "2025-03-21T14:31:46.000Z"
    };

    const barData = [
        { name: "Completed", value: data.completedAppointments },
        { name: "Missed", value: data.missedAppointments }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarCheck2 className="text-green-600" /> Total Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{data.totalAppointments}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="text-yellow-600" /> Total Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">${data.totalRevenue}</p>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="text-blue-600" /> Appointment Stats
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="text-red-600" />AI Advice
                    </CardTitle>
                </CardHeader>
                <CardContent className="font-serif">
                    ReserviHub needs to aggressively acquire its first customers.  Zero completed appointments despite some revenue suggests a problem with the booking process or user acquisition. Focus on marketing and user experience improvements to drive bookings. Analyze why appointments are missed (payment failures or cancellations) and address those issues immediately.  Consider offering incentives for completing bookings to boost initial traction and generate positive reviews.
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardStats;
