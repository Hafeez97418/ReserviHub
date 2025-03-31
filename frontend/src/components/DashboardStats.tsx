import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart2, Bot, CalendarCheck2, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BusinessAnalytics } from "../lib/types";
import { Skeleton } from "./ui/skeleton";

const DashboardStats = ({ analytics, advice }: { analytics: BusinessAnalytics; advice: string | undefined }) => {
    const data = analytics;

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
                    {advice ? advice : <div className="flex flex-col gap-4">
                        <Skeleton className="w-full h-6" />
                        <Skeleton className="w-1/2 h-6" />
                        <Skeleton className="w-full h-6" />
                        <Skeleton className="w-1/2 h-6" />
                    </div>}
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardStats;
