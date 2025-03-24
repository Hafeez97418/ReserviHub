
import { BarChart, Home, Settings, StretchHorizontal } from "lucide-react";
import AuthGate from "../components/AuthGate";
import DashboardSidebar from "../components/DashboardSideBar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

const sideBarLinks = [
    { title: "Home", url: "/", icon: <Home /> },
    { title: "Analytics", url: "/merchant", icon: <BarChart /> },
    { title: "Credentials", url: "/merchant/credentials", icon: <Settings /> },
    { title: "Slots", url: "/merchant/slots", icon: <StretchHorizontal /> }


];
function MerchantDashboard() {
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
