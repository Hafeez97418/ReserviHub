import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <div className="p-18 rounded-2xl shadow-2xl">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="text-xl mt-2">Page Not Found</p>
                <Link to="/">
                    <Button className="mt-4">Go Back</Button>
                </Link>
            </div>
        </div>
    );
}
