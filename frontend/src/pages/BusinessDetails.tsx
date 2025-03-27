import { Link, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { LibraryBig, MapPin, Star } from "lucide-react";
import { TypographyH1 } from "../components/ui/typography";
import Reviews from "../components/Reviews";
import { useEffect, useState } from "react";
import { getAllBusinesses } from "../features/business/action";
import AppointmentSlots from "../components/AppointmentSlots";

function BreadCrumbs({ pageName }: { pageName: string }) {
    return <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <div>Business</div>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>

}



function BusinessDetails() {
    const name = useParams().businessName;
    const [businessDetails, setBusinessDetails]: [businessDetails: any, setBusinessDetails: Function] = useState()
    useEffect(() => {
        (async () => {
            const { businesses } = await getAllBusinesses(0, 1, name);
            setBusinessDetails(businesses[0]);
        })()
    }, []);
    return (
        businessDetails ?
            <div>
                <BreadCrumbs pageName={name || ""} />
                <div className="grid grid-cols-1 gap-4 my-4 items-center md:grid-cols-2">
                    <img src={businessDetails.image || "/business-avatar.webp"} alt={`${businessDetails.name} avatar image`} className="w-full object-cover object-center rounded-xl min-h-80 max-h-80" />
                    <Card className="p-4 gap-4 w-full justify-center min-h-80">
                        <CardTitle>
                            <TypographyH1>
                                {businessDetails.name}
                            </TypographyH1>
                        </CardTitle>
                        <CardDescription className="md:text-sm lg:text-lg font-semibold">
                            {businessDetails.description}
                        </CardDescription>
                        <div className="font-medium text-sm flex flex-col gap-2">
                            <span className="flex gap-2">
                                <LibraryBig className="w-4 h-4" /> {businessDetails.category}
                            </span>
                            <span className="flex gap-2">
                                <MapPin className="w-4 h-4" /> {businessDetails.location}
                            </span>
                            <span className="flex gap-2">
                                <Star className="w-4 h-4" /> {businessDetails.avg_rating?.slice(0, 3) || 0}
                            </span>
                        </div>

                    </Card>
                </div>
                <AppointmentSlots businessId={businessDetails.id} />
                <Reviews businessId={businessDetails.id} />
            </div> : <div><h1>no Business found</h1></div>
    )
}

export default BusinessDetails
