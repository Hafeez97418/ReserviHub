import { Link, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import bList from "../../data/business_list.json";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { LibraryBig, MapPin, Star } from "lucide-react";
import ReviewsComponent from "../components/Reviews";
import reviews from "../../data/reviews.json";
import { TypographyH1 } from "../components/ui/typography";

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

function findBusiness(name: string) {
    //custom api logic
    const result = bList.find((business) => {
        return name === business.name;
    })
    if (!result) return { success: false, result };
    return { success: true, result }
}
function BusinessDetails() {
    const name = useParams().businessName;
    const res = findBusiness(name || "")
    let businessDetails: Record<any, string> = {};
    if (!res.success) {
        window.location.replace("/not-found");
    }
    businessDetails = res.result as any;

    return (
        <div>
            <BreadCrumbs pageName={name || ""} />
            <div className="grid grid-cols-1 gap-4 my-4 items-center md:grid-cols-2">
                <img src={businessDetails.image} alt={`${businessDetails.name} avatar image`} className="w-full object-cover object-center rounded-xl min-h-80 max-h-80" />
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
                            <Star className="w-4 h-4" /> {4.9}
                        </span>
                    </div>

                </Card>
            </div>
            <ReviewsComponent reviews={reviews as any} currentUserId="3ff02c75-7dff-47ad-b8c6-a18e2ecc0a66" onDelete={() => {
                console.log("review deleted");

            }} onUpdate={() => {
                console.log("review updated");

            }} />
        </div>
    )
}

export default BusinessDetails
