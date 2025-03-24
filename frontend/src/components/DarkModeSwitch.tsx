import { useState } from 'react'
import { Switch } from './ui/switch';
import { HandleDarkMode } from '../lib/utils';
import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

function DarkModeSwitch({ className }: { className?: string }) {
    const theme = localStorage.getItem("theme");
    const [switchState, setSwitchState] = useState(theme === "dark");

    return (
        <span className={clsx(["text-nowrap flex items-center gap-4 lg:mr-4 border-2 p-2 rounded-2xl ", className])}>
            <Switch onCheckedChange={(checked) => {
                setSwitchState(checked)
                HandleDarkMode(checked);
            }} checked={switchState} />
            {switchState ? <Moon /> : <Sun />}
        </span>
    )
}

export default DarkModeSwitch
