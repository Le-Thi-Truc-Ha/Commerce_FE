import { useContext, type JSX } from "react";
import { UserContext } from "../configs/globalVariable";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import NotFound from "../components/Other/NotFound";
import Home from "../components/Other/Home";
import Loading from "../components/Other/Loading";
import AdminPage from "../components/Admin/adminPage";
import CustomerPage from "../components/Customer/customerPage";
import Login from "../components/Other/Login";

const AppRoute = (): JSX.Element => {
    const {isLoading} = useContext(UserContext);
    return(isLoading ? <><Loading /></> :
        <Routes>
            <Route 
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* ADMIN */}
            <Route 
                path="/admin/admin-page" 
                element={
                    <PrivateRoute roleId={1}>
                        <AdminPage />
                    </PrivateRoute>
                } 
            />

            {/* CUSTOMER */}
            <Route 
                path="/customer/customer-page" 
                element={
                    <PrivateRoute roleId={2}>
                        <CustomerPage />
                    </PrivateRoute>
                } 
            />

            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoute;