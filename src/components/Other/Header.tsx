import { Badge, Col, ConfigProvider, Dropdown, Row, type MenuProps } from "antd";
import { useContext, useEffect, useState, type JSX } from "react";
import "./Header.scss";
import { ShoppingCart, User } from "lucide-react";
import { UserContext } from "../../configs/globalVariable";
import { useLocation, useNavigate } from "react-router-dom";

const Header = (): JSX.Element => {
    const {user, logoutContext, setPathBeforeLogin, cart, quantityOrder, setQuantityOrder} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [headerItemSelect, setHeaderItemSelect] = useState<number>();
    
    const headerItems: string[] = ["Trang chủ", "Sản phẩm", "Tìm kiếm"]
    const menuLogin: MenuProps["items"] = [
        {
            key: "1",
            label: user.roleId == 1 ? (
                <div onClick={() => {navigate("/admin/product")}}>Trang quản trị</div>
            ) : (
                <div onClick={() => {navigate("/customer/order");}}>Tài khoản cá nhân</div>
            )
        },
        {
            key: "2",
            label: (
                <div onClick={() => {logoutContext()}}>Đăng xuất</div>
            )
        }
    ]
    const menuLogout: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div onClick={() => {
                    navigate("/login");
                    setPathBeforeLogin(location.pathname);
                }}>
                    Đăng nhập
                </div>
            )
        },
        {
            key: "2",
            label: (
                <div onClick={() => {navigate("/create-account")}}>Tạo tài khoản</div>
            )
        }
    ]

    useEffect(() => {
        const path = location.pathname;
        if (path == "/") {
            setHeaderItemSelect(1);
        } else if (path.includes("/all-production")) {
            setHeaderItemSelect(2);
        } else if (path == "/search") {
            setHeaderItemSelect(3);
        } else {
            setHeaderItemSelect(-1);
        }
    }, [location.pathname])

    const navigateHeader = (index: number) => {
        if (index == 1) {
            navigate("/");
        } else if (index == 2) {
            navigate("/all-production/all");
        } else if (index == 3) {
            navigate("/search");
        }
    }

    return(
        <>
            <Row className="header-container container-fluid" align="middle">
                <Col span={6}>
                    <Row align="middle" justify="start" onClick={() => {navigate("/")}}>
                        <Col>
                            <div style={{cursor: "pointer", color: "black", fontFamily: "Prata", fontWeight: "600", fontSize: "30px", paddingLeft: "20px"}}>Commerce</div>
                        </Col>
                    </Row>
                </Col>
                <Col span={12} className="d-flex justify-content-center gap-4">
                    {
                        headerItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setHeaderItemSelect(index + 1);
                                    navigateHeader(index + 1)
                                }}
                                className={`header-item ${index + 1 == headerItemSelect ? "header-item-active": ""}`}
                            >
                                {item}
                            </div>
                        ))
                    }
                </Col>
                <Col span={6} className="d-flex justify-content-center gap-4">
                    <ConfigProvider
                        theme={{
                            components: {
                                Badge: {
                                    colorTextLightSolid: "var(--color8)",
                                    colorBorderBg: "var(--color8)"
                                },
                                Dropdown: {
                                    controlItemBgHover: "var(--color1)"
                                }
                            }
                        }}
                    >
                        <Badge color="var(--color1)" count={cart} onClick={() => {navigate("/customer/cart")}}>
                            <ShoppingCart size={30} strokeWidth={1} className="cart-icon"/>
                        </Badge>
                        <Dropdown
                            menu={{items: user.isAuthenticated ? menuLogin : menuLogout}}
                            placement="bottom"
                            arrow
                        >
                            <User size={30} strokeWidth={1} className="user-icon" />
                        </Dropdown>
                    </ConfigProvider>
                </Col>
            </Row>
        </>
    )
}

export default Header;