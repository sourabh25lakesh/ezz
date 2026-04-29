import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/auth";

export default function PrivateRouter({ redirectTo = "/login" }) {

    const token = getAccessToken();

    if (token) {
        return <Outlet />;
    }

    return <Navigate to={redirectTo} replace />;
}