import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, DollarSign, Loader, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Interval } from "../lib/types";
import { useEffect, useState } from "react";
import { deleteInterval, getAllSlots } from "../features/slots/action";
import { setAlertMessage } from "../features/globalSlice";


const DeleteBtn = ({ state }: { state: "none" | "loading" | "trash" }) => {
    if (state === "none") {
        return null
    } else if (state === "loading") {
        return <Loader className="animate-spin" />
    }
    else {
        return <Trash />
    }
}

const SlotsCard = () => {
    const { slots }: { slots: Interval[] } = useSelector((state: any) => state.slot)
    const [delBtnState, setDelBtnState] = useState<"trash" | "loading">("trash");
    const dispatch = useDispatch();
    useEffect(() => {
        getAllSlots();
    }, [])
    return (
        <div>
            {slots.map((appointment => {
                return <Card key={appointment.id} className="my-4 p-4 gap-4">
                    <div className="flex w-full gap-4">
                        <Clock />{appointment.startTime} - {appointment.endTime}
                    </div>
                    <div className="flex gap-4">
                        <DollarSign /> {appointment.price}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex gap-2 px-2 py-8 text-xl font-bold flex-col border-2 items-center justify-center w-40">
                            <span className="text-sm uppercase">Max slots</span>
                            {appointment.availableSlots}
                        </div>
                        <div className="flex gap-2 px-2 py-8 text-xl font-bold flex-col border-2 items-center justify-center w-40">
                            <span className="text-sm uppercase">Available slots</span>
                            {appointment.availableSlots}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="focus:text-red-500 hover:text-purple-600" onClick={async () => {
                            setDelBtnState("loading");
                            const res = await deleteInterval(appointment.id);
                            dispatch(setAlertMessage(res.message));
                            setDelBtnState("trash");
                        }}><DeleteBtn state={delBtnState} /></button>
                        <Link to={`/merchant/leads/${appointment.id}`}>
                            <Button variant={"link"} >Leads</Button>
                        </Link>
                    </div>
                    <div className="text-sm">{appointment.description}</div>
                </Card>
            }))}
        </div>
    );
};

export default SlotsCard;
