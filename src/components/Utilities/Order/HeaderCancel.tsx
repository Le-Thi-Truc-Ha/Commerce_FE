import { Col, Row } from "antd";
import { PackageX, ReceiptText, X } from "lucide-react";
import type { JSX } from "react";
import "./OrderDetailModal.scss";

interface HeaderCancelProps {
    order: string,
    cancel: string
}
const HeaderCancel = ({order, cancel}: HeaderCancelProps): JSX.Element => {
    return(
        <>
            <Row className="header-order-detail-modal-container">
                <Col span={24} style={{display: "flex", justifyContent: "center", gap: "90px"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <div className="circle">
                            <ReceiptText size={50} strokeWidth={1.5} stroke="var(--color7)" />
                        </div>
                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div>Đơn hàng đã đặt</div>
                            <div style={{fontSize: "14px", color: "#777878ff"}}>{order}</div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <div style={{width: "90px", height: "90px", backgroundColor: "var(--color7)", border: "3px solid var(--color7)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%"}}>
                            <PackageX size={50} strokeWidth={1.5} stroke="white" />
                        </div>
                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div>Đơn hàng đã hủy</div>
                            <div style={{fontSize: "14px", color: "#777878ff"}}>{cancel}</div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default HeaderCancel