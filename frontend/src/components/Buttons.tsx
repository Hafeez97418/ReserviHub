import { Loader } from "lucide-react"
import { Button } from "./ui/button"
import { MouseEventHandler } from "react"

type LoadingBtnType = {
    children: React.ReactNode,
    isLoading: boolean,
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    className?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>
}
const LoadingBtn = ({ children, isLoading, variant, className , onClick}:LoadingBtnType ) => { 
    return <Button variant={variant} className={className} onClick={onClick} disabled={isLoading}>
        {
            !isLoading ? children : <Loader className="animate-spin"/>
        }
    </Button>
}

export { LoadingBtn };