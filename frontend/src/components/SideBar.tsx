import { Calendar, Home, LogIn, Power, VenetianMask } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import DarkModeSwitch from "./DarkModeSwitch";
import { logout } from "../features/auth/action";
import { toggleSideBar } from "../features/ui/uiSlice";

function SideBar() {
    const open_sidebar: any = useSelector((state: any) => {
        return state.ui.open_sidebar;
    })
    const dispatch = useDispatch();
    return (
        <aside id="default-sidebar" className={`absolute bg-white dark:bg-black z-40 left-0 w-64 h-screen transition-transform  ${open_sidebar ? "translate-x-0" : "-translate-x-full"}  border-2 border-t-0 `} aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto ">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link to="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={() => {
                            dispatch(toggleSideBar())
                        }}>
                            <Home />
                            <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <LogIn />
                            <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/bookings" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={() => {
                            dispatch(toggleSideBar())
                        }}>
                            <Calendar />
                            <span className="flex-1 ms-3 whitespace-nowrap">Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/merchant" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={() => {
                            dispatch(toggleSideBar())
                        }}>
                            <VenetianMask />
                            <span className="flex-1 ms-3 whitespace-nowrap">Merchant</span>
                        </Link>
                    </li>
                    <li>
                        <button className="flex items-center p-2 text-gray-900 rounded-lg hover:text-white focus:text-white dark:text-white focus:bg-red-500  hover:bg-red-500 group " onClick={() => {
                            logout();
                            dispatch(toggleSideBar())
                        }}>
                            <Power />
                            <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                        </button>
                    </li>
                    <li>
                        <DarkModeSwitch className="lg:hidden w-fit" />
                    </li>
                </ul>
            </div>
        </aside >
    )
}

export default SideBar
