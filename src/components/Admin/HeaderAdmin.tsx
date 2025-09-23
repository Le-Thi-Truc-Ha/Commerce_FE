import { Col, Divider, Dropdown, Row, type MenuProps } from "antd";
import { useContext, useState, type JSX } from "react";
import "./HeaderAdmin.scss";
import { BadgePercent, CircleUserRound, List, Package, ReceiptText, TicketPercent, UsersRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../configs/globalVariable";

const HeaderAdmin = (): JSX.Element => {
    const navigate = useNavigate();
    const {logoutContext} = useContext(UserContext);
    
    const [indexOfItem, setIndexOfItem] = useState<number>(1);

    const accountItem: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div>Đổi mật khẩu</div>
            )
        },
        {
            key: "2",
            label: (
                <div onClick={() => {logoutContext()}}>Đăng xuất</div>
            )
        }
    ]

    return(
        <>
            <Row className="header-admin-container" align="middle" justify="center">
                <Col span={24} style={{height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div onClick={() => {navigate("/")}} style={{cursor: "pointer", color: "black", fontFamily: "Playfair Display", fontWeight: "600", fontSize: "30px", paddingLeft: "20px"}}>Commerce</div>
                </Col>
            </Row>
            <Row className="menu-outlet-container" align="top">
                <Col span={6} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "fit-content"}}>
                    <div className="menu-static">
                        <div className="feature-menu">
                            <div 
                                className={`menu-item ${indexOfItem == 1 ? "menu-item-active" : ""}`}
                                onClick={() => {
                                    setIndexOfItem(1);
                                }}
                            >
                                <Package size={22} strokeWidth={1} />
                                <div className="menu-item-name">Sản phẩm</div>
                            </div>
                            <div 
                                className={`menu-item ${indexOfItem == 2 ? "menu-item-active" : ""}`}
                                onClick={() => {
                                    setIndexOfItem(2);
                                }}
                            >
                                <ReceiptText size={22} strokeWidth={1} />
                                <div className="menu-item-name">Đơn hàng</div>
                            </div>
                            <div 
                                className={`menu-item ${indexOfItem == 3 ? "menu-item-active" : ""}`}
                                onClick={() => {
                                    setIndexOfItem(3);
                                }}
                            >
                                <UsersRound size={22} strokeWidth={1} />
                                <div className="menu-item-name">Khách hàng</div>
                            </div>
                            <div 
                                className={`menu-item ${indexOfItem == 4 ? "menu-item-active" : ""}`}
                                onClick={() => {
                                    setIndexOfItem(4);
                                }}
                            >
                                <BadgePercent size={22} strokeWidth={1} />
                                <div className="menu-item-name">Chương trình ưu đãi</div>
                            </div>
                            <div 
                                className={`menu-item ${indexOfItem == 5 ? "menu-item-active" : ""}`}
                                onClick={() => {
                                    setIndexOfItem(5);
                                }}
                            >
                                <TicketPercent size={22} strokeWidth={1} />
                                <div className="menu-item-name">Mã giảm giá</div>
                            </div>
                            <div 
                                className={`menu-item ${indexOfItem == 6 ? "menu-item-active" : ""}`}
                                onClick={() => {
                                    setIndexOfItem(6);
                                }}
                            >
                                <List size={22} strokeWidth={1} />
                                <div className="menu-item-name">Danh mục hàng</div>
                            </div>
                        </div>
                        <div className="account-menu">
                            <div>
                                <Divider size="small" />
                            </div>
                            <Dropdown
                                menu={{items: accountItem, style: {width: "fit-content"}}}
                                placement="topLeft"
                                arrow
                            >
                                <div style={{display: "flex", alignItems: "center", paddingLeft: "10px", paddingTop: "10px", cursor: "pointer"}}>
                                    <CircleUserRound size={35} strokeWidth={0.5} />
                                    <div style={{paddingLeft: "10px", fontSize: "18px"}}>Quản trị viên</div>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Col>
                <Col span={18} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="outlet page-container">{<Outlet />}</div>
                </Col>
            </Row>
        </>
    )
}

export default HeaderAdmin;