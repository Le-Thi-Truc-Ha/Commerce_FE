import { useContext, type JSX } from "react";
import { UserContext } from "../configs/globalVariable";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import NotFound from "../components/Other/NotFound";
import Home from "../components/Other/Home";
import Loading from "../components/Other/Loading";
import AdminPage from "../components/Admin/adminPage";
import CustomerPage from "../components/Customer/customerPage";
import Login from "../components/Other/Login";
import Header from "../components/Other/Header";

const MainRoute = (): JSX.Element => {
    return(
        <>
            <Header />
            <Outlet />
        </>
    )
}

const AuthRoute = (): JSX.Element => {
    return(
        <>
            <Outlet />
        </>
    )
}

const AppRoute = (): JSX.Element => {
    const {isLoading} = useContext(UserContext);

    return(isLoading ? <><Loading /></> :
        <Routes>
            <Route element={<AuthRoute />}>
                <Route 
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Route>
            
            <Route element={<MainRoute />}>
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
            </Route>
        </Routes>
    );
};

export default AppRoute;