import { MapPin } from "lucide-react";
import bList from "../../data/business_list.json";
import { Card, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from "react";
import { Link } from "react-router-dom";

function BusinessList() {
    const [limit, setLimit] = useState(10);
    const count = bList.length;
    const list = bList.slice(0, limit);

    return (
        <InfiniteScroll
            className="grid md:grid-cols-4 gap-4 mt-8 w-full sm:grid-cols-2 "
            dataLength={list.length}
            next={() => setLimit(prev => prev + 10)}
            hasMore={list.length < count}
            loader={<h4>Loading...</h4>}
        >
            {list.map((data) => (
                <Card key={data.id} className="gap-2 p-0">
                    <img src={data.image} alt={`${data.name} image`} className="h-30 rounded-t-2xl object-center object-cover" />
                    <div className="p-4 flex flex-col gap-1">
                        <CardHeader className="p-0 m-0 gap-0">{data.name}</CardHeader>
                        <div className="font-bold text-sm">Rating 4.8</div>
                        <CardDescription>{data.description.slice(0, 50) + "..."}</CardDescription>
                        <CardFooter className="p-0 flex justify-between">
                            <span className="font-semibold text-sm flex gap-2 items-center">
                                <MapPin className="w-4 h-4" />
                                <span>{data.location}</span>
                            </span>
                            <Link to={`/business/${data.name}`}>
                                <Button variant={"link"}>More</Button>
                            </Link>
                        </CardFooter>
                    </div>
                </Card>
            ))}
        </InfiniteScroll>
    );
}

export default BusinessList;
