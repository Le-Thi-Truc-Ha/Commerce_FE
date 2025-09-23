import { useContext, type JSX } from "react";
import { UserContext } from "../configs/globalVariable";
import { Outlet, Route, Routes } from "react-router-dom";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import NotFound from "../components/Other/NotFound";
import Home from "../components/Other/Home";
import Loading from "../components/Other/Loading";
import AdminPage from "../components/Admin/adminPage";
import CustomerPage from "../components/Customer/customerPage";
import Login from "../components/Other/Login";
import Header from "../components/Other/Header";
import CreateAccount from "../components/Other/CreateAccount";
import HeaderAdmin from "../components/Admin/HeaderAdmin";

const HeaderCustomer = (): JSX.Element => {
    return(
        <>
            <Header />
            <Outlet />
        </>
    )
}

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
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="*" element={<NotFound />} />
            
            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute roleId={1}>
                        <HeaderAdmin />
                    </PrivateRoute>
                } 
            >
                <Route path="admin-page" element={<AdminPage />} />
            </Route>

            <Route element={<HeaderCustomer />}>
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