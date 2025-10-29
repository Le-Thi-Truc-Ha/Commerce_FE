import { Col, Divider, Dropdown, Row, type MenuProps } from "antd";
import { useContext, useEffect, useState, type JSX } from "react";
import "./HeaderAdmin.scss";
import { BadgePercent, CircleUserRound, House, List, Package, ReceiptText, TicketPercent, UsersRound } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../configs/globalVariable";

const HeaderAdmin = (): JSX.Element => {
    const navigate = useNavigate();
    const {logoutContext} = useContext(UserContext);
    const location = useLocation();
    
    const [indexOfItem, setIndexOfItem] = useState<number>(1);
    const iconsItem = [House, Package, ReceiptText, UsersRound, BadgePercent, TicketPercent, List]
    const nameItem = ["Trang chủ", "Sản phẩm", "Đơn hàng", "Khách hàng", "Chương trình ưu đãi", "Mã giảm giá", "Danh mục hàng"]

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

    useEffect(() => {
        const path = location.pathname;
        if (path == "/admin") {  // Trang chủ
            setIndexOfItem(1);
        } else if (path == "/admin/product") {  // Sản phẩm
            setIndexOfItem(2);
        } else if (path == "") {  // Đơn hàng
            setIndexOfItem(3);
        } else if (path == "") {  // Khách hàng
            setIndexOfItem(4);
        } else if (path == "") {  // Chương trình ưu đãi
            setIndexOfItem(5);
        } else if (path == "") {  // Mã giảm giá
            setIndexOfItem(6);
        } else if (path == "") {  // Danh mục hàng
            setIndexOfItem(7);
        }
    }, [])

    const navigateMenu = (index: number) => {
        if (index == 1) {  // Trang chủ
            navigate("");
        } else if (index == 2) {  // Sản phẩm
            navigate("/admin/product");
        } else if (index == 3) {  // Đơn hàng
            navigate("");
        } else if (index == 4) {  // Khách hàng
            navigate("");
        } else if (index == 5) {  // Chương trình ưu đãi
            navigate("");
        } else if (index == 6) {  // Mã giảm giá
            navigate("");
        } else if (index == 7) {  // Danh mục hàng
            navigate("");
        }
    }

    return(
        <>
            <Row className="header-admin-container" align="middle" justify="center">
                <Col span={24} style={{height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div onClick={() => {navigate("/")}} style={{cursor: "pointer", color: "black", fontFamily: "Prata", fontWeight: "600", fontSize: "30px", paddingLeft: "20px"}}>Commerce</div>
                </Col>
            </Row>
            <Row className="menu-outlet-container" align="top">
                <Col span={5} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "fit-content", position: "sticky", top: "80px"}}>
                    <div className="menu-static">
                        <div className="feature-menu">
                            {
                                iconsItem.map((Item, index) => (
                                    <div 
                                        key={index}
                                        className={`admin-menu-item ${indexOfItem == index + 1 ? "admin-menu-item-active" : ""}`}
                                        onClick={() => {
                                            setIndexOfItem(index + 1);
                                            navigateMenu(index + 1);
                                        }}
                                    >
                                        <Item size={22} strokeWidth={1} />
                                        <div className="admin-menu-item-name">{nameItem[index]}</div>
                                    </div>
                                ))
                            }
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
                <Col span={19} style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                    <div className="outlet page-container">{<Outlet />}</div>
                </Col>
            </Row>
        </>
    )
}

export default HeaderAdmin;