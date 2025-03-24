import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, DollarSign, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const SlotsCard = () => {
    // { businessId }: { businessId: string, }
    const appointments = [{
        id: 1,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate doloremque amet sapiente tenetur repudiandae est, similique harum vitae quaerat. Officia laborum quod accusantium commodi quas, iste blanditiis architecto suscipit consequatur.",
        startTime: "11:00:00",
        endTime: "12:00:00",
        price: "200.00",
        maxSlots: 20,
        availableSlots: 20,
    },
    {
        id: 2,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate doloremque amet sapiente tenetur repudiandae est, similique harum vitae quaerat. Officia laborum quod accusantium commodi quas, iste blanditiis architecto suscipit consequatur.",
        startTime: "11:00:00",
        endTime: "12:00:00",
        price: "200.00",
        maxSlots: 20,
        availableSlots: 20,
    },
    ]
    return (
        <div>
            {appointments.map((appointment => {
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
                        <button className="focus:text-red-500 hover:text-purple-600"><Trash /></button>
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
