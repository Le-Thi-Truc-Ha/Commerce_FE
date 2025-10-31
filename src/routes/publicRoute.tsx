import { useContext, type JSX, type ReactNode } from "react";
import { UserContext } from "../configs/globalVariable";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({children}: PublicRouteProps): JSX.Element => {
    const {user, pathBeforeLogin} = useContext(UserContext);
    if (user.isAuthenticated) {
        if (user.roleId == 1) {
            return <Navigate to="/admin" replace />
        }
        return <Navigate to={pathBeforeLogin} replace />
    }
    
    return(
        <>{children}</>
    );
};

export default PublicRoute;