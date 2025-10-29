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
import Dashboard from "../components/Admin/Dashboard";
import ProductAdmin from "../components/Admin/ProductAdmin";
import ProductDetail from "../components/Admin/ProductDetail";
import OrderAdmin from "../components/Admin/Order";
import CustomerAdmin from "../components/Admin/Customer";
import PromotionAdmin from "../components/Admin/Promotion";
import VoucherAdmin from "../components/Admin/Voucher";
import CategoryAdmin from "../components/Admin/Category";

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
                <Route path="" element={<Dashboard />} />
                <Route path="product" element={<ProductAdmin />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="order" element={<OrderAdmin />} />
                <Route path="promotion" element={<CustomerAdmin />} />
                <Route path="promotion" element={<PromotionAdmin />} />
                <Route path="voucher" element={<VoucherAdmin />} />
                <Route path="category" element={<CategoryAdmin />} />
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