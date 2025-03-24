import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticateMe } from "../features/auth/action";

export default function AuthGate({ userRole }: { userRole?: "manager" | "admin" }) {
    const [auth, setAuth] = useState("PENDING");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const data = await authenticateMe();
            
            if (!data || !data.success) {
                setAuth("UNAUTHORIZED");
                return;
            }
            setRole(data.user.role);
            setAuth("AUTHORIZED");
        })();
    }, []);

    useEffect(() => {
        if (auth === "UNAUTHORIZED") {
            navigate("/login");
            return;
        }
        console.log(`auth ${auth} --> user-role ${userRole} --> role ${role}`);

        // Redirect if role does not match the required userRole
        if (auth === "AUTHORIZED" && userRole && role !== userRole) {
            if (userRole === "manager") {
                navigate("/merchant/create-account");
            } else {
                navigate("/unauthorized")
            }
        }
    }, [auth, role, userRole, navigate]);

    if (auth === "PENDING") {
        return <div>loading</div>;
    }

    if (auth === "AUTHORIZED" && (!userRole || role === userRole)) {
        return <Outlet />;
    }

    return null;
}
