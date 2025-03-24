import { useState } from "react"
import SlotsCard from "../components/SlotsCard"
import { TimePicker12Demo } from "../components/TimePicker"
import { TypographyH1, TypographyH3 } from "../components/ui/typography"
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function Slots() {
    const [date, setDate]: any = useState(new Date());
    const [endDate, setEndDate]: any = useState(new Date());
    const [data, setData] = useState({
        price: 0,
        description: "",
        maxSlots: 1,
        availableSlots: 1,
        startTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        endTime: `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`
    });

    return (
        <div className="p-4">
            <TypographyH1>your appointment slots</TypographyH1>
            <div className="my-8">
                <Card className="bg-black text-white px-4">
                    <TypographyH3>Create Appointment Slot</TypographyH3>
                    <div className="flex flex-col gap-4">
                        <div>Start Time</div>
                        <TimePicker12Demo date={date} setDate={(date) => {
                            setDate(date);
                        }} />
                        <div>End Time</div>
                        <TimePicker12Demo date={endDate} setDate={(date) => {
                            setEndDate(date);
                        }} />
                        <Input type="number" placeholder="your appointments price" onChange={(e) => {
                            setData({ ...data, price: Number(e.target.value) });
                        }} />
                        <Input type="number" id="maxSlots" placeholder="max slots of your appointment" onChange={(e) => {
                            const val = Number(e.target.value);
                            setData({ ...data, maxSlots: val, availableSlots: val })
                        }} />
                        <Textarea id="description" placeholder="your appointments description" onChange={(e) => {
                            setData({ ...data, description: e.target.value });
                        }} />
                    </div>

                    <Button onClick={() => {}}>Create</Button>
                </Card>
            </div>
            <SlotsCard />
        </div>
    )
}

export default Slots
