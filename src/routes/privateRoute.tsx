import { useContext, type JSX, type ReactNode } from "react";
import { UserContext } from "../configs/globalVariable";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: ReactNode,
    roleId: number
}

const PrivateRoute = ({children, roleId}: PrivateRouteProps): JSX.Element => {
    const {user} = useContext(UserContext);
    
    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user.roleId != roleId) {
        return <Navigate to="*" replace />
    }

    return(
        <>{children}</>
    );
};

export default PrivateRoute;