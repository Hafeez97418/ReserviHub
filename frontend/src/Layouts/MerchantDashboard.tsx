import { BarChart, Home, Settings, StretchHorizontal } from "lucide-react";
import AuthGate from "../components/AuthGate";
import DashboardSidebar from "../components/DashboardSideBar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { useEffect } from "react";
import { getMyBusiness } from "../features/business/action";

const sideBarLinks = [
    { title: "Home", url: "/", icon: <Home /> },
    { title: "Analytics", url: "/merchant", icon: <BarChart /> },
    { title: "Credentials", url: "/merchant/credentials", icon: <Settings /> },
    { title: "Slots", url: "/merchant/slots", icon: <StretchHorizontal /> }
];


function MerchantDashboard() {
    useEffect(() => {
        (async () => {
            const res = await getMyBusiness();
            if (res.success) {
                sessionStorage.setItem("businessId", res.business.id);
            }
        })()
    }, []);
    return (
        <div>
            <SidebarProvider>
                <DashboardSidebar items={sideBarLinks} />
                <div className="w-full">
                    <SidebarTrigger className="m-4" />
                    <AuthGate userRole="manager" />
                </div>
            </SidebarProvider>

        </div>
    )
}

export default MerchantDashboard
