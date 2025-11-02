import { Col, Row } from "antd";
import { BadgeDollarSign, PackageCheck, ReceiptText, Truck, Undo2 } from "lucide-react";
import type { JSX } from "react";
import "./OrderDetailModal.scss";

interface HeaderNormalProps {
    order: string,
    transit: string,
    receive: string,
    returnProduct: string,
    currentStatus: number,
    paymentTime: string | null,
    paymentMethod: number
}
const HeaderNormal = ({order, transit, receive, returnProduct, currentStatus, paymentTime, paymentMethod}: HeaderNormalProps): JSX.Element => {
    return(
        <> 
            <Row className="header-normal-order-detail-modal-container">
                <Col span={24} style={{display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "90px"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <div style={{position: "relative"}}>
                            <div className={`circle ${currentStatus == 2 && (!paymentTime || paymentMethod == 2) ? "circle-active" : ""}`}>
                                <ReceiptText size={50} strokeWidth={1.5} stroke={`${currentStatus == 2 && (!paymentTime || paymentMethod == 2) ? "white" : "var(--color7)"}`} />
                            </div>
                            <div 
                                style={{
                                    width: "190px", 
                                    height: "3px", 
                                    backgroundColor: "var(--color7)", 
                                    position: "absolute",
                                    top: "50%",
                                    transform: "translate(47%, -50%)"
                                }}
                            ></div>
                        </div>
                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div>Đơn hàng đã đặt</div>
                            <div style={{fontSize: "14px", color: "#777878ff"}}>{order}</div>
                        </div>
                    </div>
                    {
                        paymentMethod == 1 && (
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <div style={{position: "relative"}}>
                                    <div className={`circle ${currentStatus == 2 ? "circle-active" : ""}`}>
                                        <BadgeDollarSign size={50} strokeWidth={1.5} stroke={`${currentStatus == 2 ? "white" : "var(--color7)"}`} />
                                    </div>
                                    <div 
                                        style={{
                                            width: "180px", 
                                            height: "3px", 
                                            backgroundColor: "var(--color7)", 
                                            position: "absolute",
                                            top: "50%",
                                            transform: "translate(49%, -50%)"
                                        }}
                                    ></div>
                                </div>
                                <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <div>Đơn hàng đã thanh toán</div>
                                    <div style={{fontSize: "14px", color: "#777878ff"}}>{paymentTime ? paymentTime : "-"}</div>
                                </div>
                            </div>
                        )
                    }
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <div style={{position: "relative"}}>
                            <div className={`circle ${currentStatus == 3 ? "circle-active" : ""}`}>
                                <Truck size={50} strokeWidth={1.5} stroke={`${currentStatus == 3 ? "white" : "var(--color7)"}`} />
                            </div>
                            <div 
                                style={{
                                    width: "150px", 
                                    height: "3px", 
                                    backgroundColor: "var(--color7)", 
                                    position: "absolute",
                                    top: "50%",
                                    transform: "translate(59%, -50%)"
                                }}
                            ></div>
                        </div>
                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div>Đơn hàng đang giao</div>
                            <div style={{fontSize: "14px", color: "#777878ff"}}>{transit}</div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <div style={{position: "relative"}}>
                            <div className={`circle ${(currentStatus == 4 || currentStatus == 6) && (!paymentTime || paymentMethod == 1) ? "circle-active" : ""}`}>
                                <PackageCheck size={50} strokeWidth={1.5} stroke={`${(currentStatus == 4 || currentStatus == 6) && (!paymentTime || paymentMethod == 1) ? "white" : "var(--color7)"}`} />
                            </div>
                            {
                                (paymentMethod == 2 || currentStatus == 5) && (
                                    <div 
                                        style={{
                                            width: "170px", 
                                            height: "3px", 
                                            backgroundColor: "var(--color7)", 
                                            position: "absolute",
                                            top: "50%",
                                            transform: "translate(52%, -50%)"
                                        }}
                                    ></div>
                                )
                            }
                        </div>
                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div>Đơn hàng đã giao</div>
                            <div style={{fontSize: "14px", color: "#777878ff"}}>{receive}</div>
                        </div>
                    </div>
                    {
                        paymentMethod == 2 && (
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <div style={{position: "relative"}}>
                                    <div className={`circle ${(currentStatus == 4 || currentStatus == 6) && (paymentTime) ? "circle-active" : ""}`}>
                                        <BadgeDollarSign size={50} strokeWidth={1.5} stroke={`${(currentStatus == 4 || currentStatus == 6) && (paymentTime) ? "white" : "var(--color7)"}`} />
                                    </div>
                                    {
                                        currentStatus == 5 && (
                                            <div 
                                                style={{
                                                    width: "150px", 
                                                    height: "3px", 
                                                    backgroundColor: "var(--color7)", 
                                                    position: "absolute",
                                                    top: "50%",
                                                    transform: "translate(59%, -50%)"
                                                }}
                                            ></div>
                                        )
                                    }
                                </div>
                                <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <div>Đơn hàng đã thanh toán</div>
                                    <div style={{fontSize: "14px", color: "#777878ff"}}>{paymentTime ? paymentTime : ""}</div>
                                </div>
                            </div>
                        )
                    }
                    {
                        currentStatus == 5 && (
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <div style={{position: "relative"}}>
                                    <div className={`circle ${currentStatus == 5 ? "circle-active" : ""}`}>
                                        <Undo2 size={50} strokeWidth={1.5} stroke={`${currentStatus == 5 ? "white" : "var(--color7)"}`} />
                                    </div>
                                </div>
                                <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <div>Trả hàng</div>
                                    <div style={{fontSize: "14px", color: "#777878ff"}}>{returnProduct}</div>
                                </div>
                            </div>
                        )
                    }
                </Col>
            </Row>
        </>
    )
}

export default HeaderNormal;