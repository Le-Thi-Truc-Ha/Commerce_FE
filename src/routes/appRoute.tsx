import { useContext, type JSX } from "react";
import { UserContext } from "../configs/globalVariable";
import { Outlet, Route, Routes } from "react-router-dom";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import NotFound from "../components/Other/NotFound";
import Home from "../components/Other/Home";
import Loading from "../components/Other/Loading";
import Login from "../components/Other/Login";
import Header from "../components/Other/Header";
import CreateAccount from "../components/Other/CreateAccount";
import HeaderAdmin from "../components/Admin/HeaderAdmin";
import ProductAdmin from "../components/Admin/ProductAdmin";
import Profile from "../components/Customer/ProfileComponent/Profile";
import HeaderCustomer from "../components/Customer/HeaderCustomer";
import Order from "../components/Customer/Order";
import Favourite from "../components/Customer/Favourite";
import History from "../components/Customer/History";
import AllProduction from "../components/Other/AllProduction/AllProduction";
import SearchProduction from "../components/Other/SearchProduction";
import Cart from "../components/Customer/Cart";
import Pay from "../components/Customer/Pay";
import ProductList from "../components/Other/AllProduction/ProductionList";
import ProductionDetail from "../components/Other/ProductionDetail";

const HeaderOverall = (): JSX.Element => {
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
                <Route path="product" element={<ProductAdmin />} />
            </Route>

            {/* CUSTOMER */}
            <Route
                path="/customer"
                element={
                    <PrivateRoute roleId={2}>
                        <HeaderCustomer />
                    </PrivateRoute>
                } 
            >
                <Route path="order" element={<Order />} />
                <Route path="favourite" element={<Favourite />} />
                <Route path="history" element={<History />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            {/* PUBLIC */}
            <Route element={<HeaderOverall />}>
                <Route path="/" element={<Home />} />
                <Route path="/all-production" element={<AllProduction />}>
                    <Route path=":category" element={<ProductList />} />
                </Route>
                <Route path="/search" element={<SearchProduction />} />
                <Route path="/all-production/:category/:id" element={<ProductionDetail />} />
                <Route 
                    path="/customer/cart"
                    element={
                        <PrivateRoute roleId={2}>
                            <Cart />
                        </PrivateRoute>
                    }
                />
                <Route 
                    path="/customer/pay"
                    element={
                        <PrivateRoute roleId={2}>
                            <Pay />
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    );
};

export default AppRoute;