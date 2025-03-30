import { MapPin } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinesses, getBusinessByAi } from "../features/business/action";
import { replaceBusinessList, setAiSearch, setBusinessList, setSearch, setSearchValue } from "../features/business/slice";
import { TypographyH3 } from "./ui/typography";
import { Business, State } from "../lib/types";

function BusinessList() {
    const dispatch = useDispatch();
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(NaN);
    const [fetchType, setFetchType] = useState("search")
    const { searchValue, search, businessList, aiSearch } = useSelector((state: State) => state.business);
    useEffect(() => {
        (async () => {
            let data;
            if (aiSearch) {
                data = await getBusinessByAi(searchValue);
            } else {
                data = await getAllBusinesses(skip, limit, searchValue);
            }
            if (searchValue.length > 0 && !aiSearch) {
                setFetchType("search");
                dispatch(replaceBusinessList(data.businesses))
            } else if (aiSearch) {
                setFetchType("search");
                dispatch(replaceBusinessList(data.rows));
            } else {
                setFetchType("auto");
                dispatch(setBusinessList(data.businesses))
            }
            setCount(data.count || 0)
            dispatch(setSearchValue(""));
        })();
    }, [search])

    return (
        <div>
            {count === 0 ? <TypographyH3 className="my-4">No Businesses found</TypographyH3> : null}
            {fetchType === "search" ? <Button variant={"outline"} onClick={() => {
                if (aiSearch) dispatch(setAiSearch());
                dispatch(setSearch())
            }} className="my-4">reset feed</Button> : ""}
            <InfiniteScroll
                className="grid md:grid-cols-4 gap-4 mt-8 w-full sm:grid-cols-2 "
                dataLength={businessList.length}
                next={() => {
                    setSkip(skip + limit)
                    setLimit(prev => prev + 10)
                }}
                hasMore={businessList.length < count}
                loader={<h4>Loading...</h4>}
            >
                {businessList.map((data: Business) => (
                    <Card key={data.id} className="gap-2 p-0">
                        <img src={data.image || "/business-avatar.webp"} alt={`${data.name} image`} className="h-30 rounded-t-2xl object-center object-cover" />
                        <div className="p-4 flex flex-col gap-1">
                            <CardHeader className="p-0 m-0 gap-0">{data.name}</CardHeader>
                            <div className="font-bold text-sm">Ratings: {data.avg_rating?.slice(0, 3) || 0}</div>
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
        </div>
    );
}

export default BusinessList;
