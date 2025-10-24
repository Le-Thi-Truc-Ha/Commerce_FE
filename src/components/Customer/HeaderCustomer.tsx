import { Col, ConfigProvider, Row } from "antd";
import { useEffect, useState, type JSX } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Other/Header";
import { Heart, ListChecks, Package, UserPen } from "lucide-react";
import "./HeaderCustomer.scss";
import { configProvider } from "../../interfaces/appInterface";

const HeaderCustomer = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();

    const [indexOfItem, setIndexOfItem] = useState<number>(1);
    const iconsItem = [Package, Heart, ListChecks, UserPen]
    const nameItem = ["Đơn hàng", "Sản phẩm yêu thích", "Sản phẩm đã xem", "Thông tin cá nhân"]

    useEffect(() => {
        const path = location.pathname;
        if (path == "/customer/order") {  // Đơn hàng
            setIndexOfItem(1);
        } else if (path == "/customer/favourite") {  // Yêu thích
            setIndexOfItem(2);
        } else if (path == "/customer/history") {  // Đã xem
            setIndexOfItem(3);
        } else if (path == "/customer/profile") {  // Thông tin
            setIndexOfItem(4);
        }
    }, [])

    const navigateMenu = (index: number) => {
        if (index == 1) {  // Đơn hàng
            navigate("/customer/order");
        } else if (index == 2) {  // Yêu thích
            navigate("/customer/favourite");
        } else if (index == 3) {  // Đã xem
            navigate("/customer/history");
        } else if (index == 4) {  // Thông tin
            navigate("/customer/profile");
        } 
    }
    
    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
                <Header />
                <Row className="menu-outlet-container" align="top">
                    <Col span={5} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "fit-content", position: "sticky", top: "80px"}}>
                        <div className="menu-static">
                            <div className="feature-menu">
                                {
                                    iconsItem.map((Item, index) => (
                                        <div 
                                            key={index}
                                            className={`menu-item ${indexOfItem == index + 1 ? "menu-item-active" : ""}`}
                                            onClick={() => {
                                                setIndexOfItem(index + 1);
                                                navigateMenu(index + 1);
                                            }}
                                        >
                                            <Item size={22} strokeWidth={1} />
                                            <div className="menu-item-name">{nameItem[index]}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </Col>
                    <Col span={19} style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                        <div className="outlet page-container">{<Outlet />}</div>
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    )
}

export default HeaderCustomer;