import { Menu, Search, X } from "lucide-react";
import { TypographyH3 } from "./ui/typography";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { useState } from "react";
import DarkModeSwitch from "./DarkModeSwitch";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../features/ui/uiSlice";
import { setSearch, setSearchValue } from "../features/business/slice";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const { searchValue
    } = useSelector((state: any) => state.business);
    const [aiToggleState, setAiToggleState] = useState(false);
    const dispatch = useDispatch();
    const open_sidebar = useSelector((state: any) => state.ui.open_sidebar);
    return (
        <nav className="flex md:items-center md:flex-row p-4 justify-between flex-col items-start gap-4 border-2 bg-white w-full dark:bg-black dark:text-white"  >
            <div className="flex items-center gap-4 ">
                {open_sidebar ?
                    <X className="cursor-pointer " width={35} height={35} onClick={() => {
                        dispatch(toggleSideBar())
                    }} />
                    :
                    <Menu className="cursor-pointer " width={35} height={35} onClick={() => {
                        dispatch(toggleSideBar())
                    }} />
                }
                <TypographyH3 className="cursor-pointer">
                    ReserviHub
                </TypographyH3>

            </div>
            <div className="flex items-center gap-3 ">
                <DarkModeSwitch className="hidden md:flex" />
                <Input placeholder="Search" onChange={(e) => {
                    dispatch(setSearchValue(e.target.value));
                }} value={searchValue} />
                <Button variant={"secondary"} className="focus:bg-purple-500 focus:text-white" onClick={() => {
                    navigate("/");
                    dispatch(setSearch());
                }}>
                    <div>
                        <Search />
                    </div>
                </Button>
                <Toggle
                    data-state={aiToggleState}
                    onPressedChange={(pressed) => {
                        setAiToggleState(pressed);
                    }}
                    style={{
                        backgroundColor: aiToggleState ? "#bb02db" : "",
                        color: aiToggleState ? "white" : ""
                    }}
                >
                    AI
                </Toggle>
            </div>
        </nav>
    )
}

export default NavBar
