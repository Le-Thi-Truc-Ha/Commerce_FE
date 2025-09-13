import { Badge, Col, ConfigProvider, Dropdown, Row, type MenuProps } from "antd";
import { useContext, useState, type JSX } from "react";
import "./Header.scss";
import { ShoppingCart, User } from "lucide-react";
import { UserContext } from "../../configs/globalVariable";
import { useNavigate } from "react-router-dom";

const Header = (): JSX.Element => {
    const {user, logoutContext} = useContext(UserContext);
    const navigate = useNavigate();
    const [headerItemSelect, setHeaderItemSelect] = useState<number>(1);
    
    const headerItems: {id: number, label: string}[] = [
        {id: 1, label: "Trang chủ"},
        {id: 2, label: "Sản phẩm"},
        {id: 3, label: "Tìm kiếm"}
    ]
    const menuLogin: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div>Tài khoản cá nhân</div>
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
                <div onClick={() => {navigate("/login")}}>Đăng nhập</div>
            )
        },
        {
            key: "2",
            label: (
                <div onClick={() => {navigate("/create-account")}}>Tạo tài khoản</div>
            )
        }
    ]
    return(
        <>
            <Row className="header-container container-fluid" align="middle">
                <Col span={6}>
                    <Row align="middle" justify="start" onClick={() => {navigate("/")}}>
                        <Col>
                            <div style={{cursor: "pointer", color: "black", fontFamily: "Playfair Display", fontWeight: "600", fontSize: "30px", paddingLeft: "20px"}}>Commerce</div>
                        </Col>
                    </Row>
                </Col>
                <Col span={12} className="d-flex justify-content-center gap-4">
                    {
                        headerItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {setHeaderItemSelect(item.id)}}
                                className={`header-item ${item.id == headerItemSelect ? "header-item-active": ""}`}
                            >
                                {item.label}
                            </div>
                        ))
                    }
                </Col>
                <Col span={6} className="d-flex justify-content-center gap-4">
                    <ConfigProvider
                        theme={{
                            components: {
                                Badge: {
                                    colorTextLightSolid: "var(--baseFive)",
                                    colorBorderBg: "var(--baseFive)"
                                },
                                Dropdown: {
                                    controlItemBgHover: "var(--baseOne)"
                                }
                            }
                        }}
                    >
                        <Badge color="var(--baseOne)" count={100}>
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