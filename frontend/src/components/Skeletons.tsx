import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const HomeCard = () => {
    return (
        <Card className="gap-2 p-4 flex flex-col animate-pulse">
            <Skeleton className="h-40 w-full rounded-t-2xl" />
            <div className="flex flex-col gap-2 mt-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </Card>
    );
};

const HomeCardGroup = () => {
    return (
        <div className="grid md:grid-cols-4 gap-4 mt-8 w-full sm:grid-cols-2">
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
        </div>
    );
};

const DashboardStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        </div>
    );
};


const BookingSkeleton = () => {
    return (
        <Card className="w-full shadow-xl rounded-2xl">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 w-1/2">
                    <Skeleton className="h-6 w-full" />
                </CardTitle>
                <Badge variant="outline">
                    <Skeleton className="h-6 w-14" />
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
                <div className="flex gap-2 flex-wrap">
                    <Skeleton className="w-12 h-8 rounded-xl" />
                    <Skeleton className="w-12 h-8 rounded-xl" />
                    <Skeleton className="w-12 h-8 rounded-xl" />
                </div>
            </CardContent>
        </Card>
    )
}

const MyBookingsSkeleton = () => {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
        </div>
    );
};

const BusinessDetailsSkeleton = () => {
    return <div>
        <div className="grid grid-cols-1 gap-4 my-4 items-center md:grid-cols-2">
            <Skeleton className="w-full rounded-xl min-h-80 max-h-80" />
            <Card className="p-4 gap-4 w-full justify-center min-h-80">
                <CardTitle className="w-full">
                    <Skeleton className="h-12 w-full"></Skeleton>
                </CardTitle>
                <CardDescription>
                    <Skeleton className="w-20 h-6" />
                </CardDescription>
                <div className="font-medium text-sm flex flex-col gap-2">
                    <span className="flex gap-2">
                        <Skeleton className="w-4 h-4" /> <Skeleton className="w-12" />
                    </span>
                    <span className="flex gap-2">
                        <Skeleton className="w-4 h-4" /> <Skeleton className="w-16" />
                    </span>
                    <span className="flex gap-2">
                        <Skeleton className="w-4 h-4" />  <Skeleton className="w-12" />
                    </span>
                </div>

            </Card>
        </div>
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-32 mt-4" />
    </div>
}


const BusinessInfoSkeleton = () => {
    return <div className="w-full p-4 rounded-2xl shadow-lg">
        <div className="flex flex-col gap-4">
            <div className="mb-6 my-4">
                <Skeleton className="h-6 w-1/2"></Skeleton>
                <Skeleton className="h-6 w-full mt-4"></Skeleton>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-8 1/2" />
        </div>
    </div>
}

const CredentialsSkeleton = () => {
    return <div className="p-4">
        <Skeleton className="w-full h-8" />
        <section className="flex gap-4 w-full min-w-60 flex-wrap lg:flex-nowrap my-4">
            <Card className="w-full flex-col items-center justify-around p-4">
                <Skeleton
                    className="h-60 w-full rounded-lg"
                />
                <div className="flex my-4 w-full justify-between">
                    <Skeleton className="w-12 h-8" />
                    <Skeleton className="w-12 h-8" />
                </div>
            </Card>
            <BusinessInfoSkeleton />
        </section>
        <section className="my-4 flex p-4 border-2 justify-between flex-wrap md:flex-nowrap gap-4">
            <Skeleton className="w-1/2 h-6" />
            <Skeleton className="w-12 h-8" />
        </section>
    </div>
}

const LeadsComponentSkeleton = () => {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[...Array(2)].map((_, index) => (
                <Card key={index} className="w-full shadow-xl rounded-2xl">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <Skeleton className="h-6 w-40" />
                        </CardTitle>
                        <Skeleton className="h-6 w-20" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export {
    HomeCard,
    HomeCardGroup,
    DashboardStatsSkeleton,
    BookingSkeleton,
    MyBookingsSkeleton,
    BusinessDetailsSkeleton,
    BusinessInfoSkeleton,
    CredentialsSkeleton,
    LeadsComponentSkeleton
};
