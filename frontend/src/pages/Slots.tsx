import { useState, useEffect } from "react";
import SlotsCard from "../components/SlotsCard";
import { TimePicker12Demo } from "../components/TimePicker";
import { TypographyH1, TypographyH3 } from "../components/ui/typography";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { createInterval } from "../features/slots/action";
import { Interval } from "../lib/types";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "../features/globalSlice";
import { Loader } from "lucide-react";

function Slots() {
    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const time24 = `${hours}:${minutes}:${seconds}`;        
        return time24;
    };

    const [date, setDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [saveBtn, setSaveBtn] = useState<React.ReactNode>("Create");

    const [data, setData] = useState<Partial<Interval>>({
        price: 0,
        description: "",
        maxSlots: 1,
        availableSlots: 1,
        startTime: formatTime(date),
        endTime: formatTime(endDate),
    });

    // Update startTime and endTime when date or endDate changes
    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            startTime: formatTime(date),
            endTime: formatTime(endDate),
        }));
    }, [date, endDate]);

    const dispatch = useDispatch();

    return (
        <div className="p-4">
            <TypographyH1>Your Appointment Slots</TypographyH1>
            <div className="my-8">
                <Card className="bg-black text-white px-4">
                    <TypographyH3>Create Appointment Slot</TypographyH3>
                    <div className="flex flex-col gap-4">
                        <div>Start Time</div>
                        <TimePicker12Demo date={date} setDate={setDate as any} />
                        <div>End Time</div>
                        <TimePicker12Demo date={endDate} setDate={setEndDate as any} />
                        <Input type="number" placeholder="Your appointment price" onChange={(e) => {
                            setData((prev) => ({ ...prev, price: Number(e.target.value) }));
                        }} />
                        <Input type="number" id="maxSlots" placeholder="Max slots of your appointment" onChange={(e) => {
                            const val = Number(e.target.value);
                            setData((prev) => ({ ...prev, maxSlots: val, availableSlots: val }));
                        }} />
                        <Textarea id="description" placeholder="Your appointment description" onChange={(e) => {
                            setData((prev) => ({ ...prev, description: e.target.value }));
                        }} />
                    </div>

                    <Button onClick={async () => {
                        setSaveBtn(<Loader />);
                        const res = await createInterval(data);
                        if (res.success) {
                            dispatch(setAlertMessage(res.message));
                        }
                        setSaveBtn("Create");
                    }}>{saveBtn}</Button>
                </Card>
            </div>
            <SlotsCard />
        </div>
    );
}

export default Slots;
