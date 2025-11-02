import { useContext, useEffect, useState, type JSX } from "react";
import { type OrderDetailData, type OrderDetailModalProps } from "../../../interfaces/customerInterface";
import { Col, Modal, Row } from "antd";
import { Circle, X } from "lucide-react";
import { messageService } from "../../../interfaces/appInterface";
import { getOrderDetailApi } from "../../../services/customerService";
import { UserContext } from "../../../configs/globalVariable";
import HeaderCancel from "./HeaderCancel";
import HeaderNormal from "./HeaderNormal";
import { RateValue } from "../../Other/ProductionDetail";
import dayjs, { Dayjs } from "dayjs";

const OrderDetailModal = ({open, setOpen, orderId}: OrderDetailModalProps): JSX.Element => {
    const {user} = useContext(UserContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null)
    const [timeStatus, setTimeStatus] = useState<string[]>(["", "", "", "", "", ""])

    useEffect(() => {
        if (open) {
            getOrderDetail();
        }
    }, [open])
    const getOrderDetail = async () => {
        setLoading(true);
        try {
            const result = await getOrderDetailApi(user.accountId, orderId)
            if (result.code == 0) {
                const chanegType = {
                    ...result.data, 
                    overallData: {
                        ...result.data.overallData,
                        statusHistory: result.data.overallData.statusHistory.map((item: any) => (
                            {
                                id: item.id,
                                status: item.status ?? -1,
                                date: dayjs(item.date)
                            }
                        ))   
                    }
                }
                setOrderDetail(chanegType)
                const statusList: {id: number, status: number, date: string}[] = result.data.overallData.statusHistory
                for (const item of statusList) {
                    setTimeStatus((prev) => (
                        prev.map((itemChild, indexChild) => (
                            indexChild == item.status - 1 ? dayjs(item.date).format("DD/MM/YYYY HH:mm") : itemChild
                        ))
                    ))
                }
            } else {
                messageService.error(result.message)
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setLoading(false);
        }
    }
    return(
        <>
            <Modal
                title={null}
                footer={null}
                closable={false}
                centered={true}
                maskClosable={false}
                open={open}
                width={"1200px"}
                loading={loading}
            >
                <Row style={{maxHeight: "600px", overflowY: "auto", margin: "-20px -24px -20px -24px", padding: "20px 30px"}}>
                    {
                        (!loading && !orderDetail) && (
                            <Col span={24} style={{padding: "30px 0px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <div style={{width: "50%", height: "400px", overflow: "hidden"}}>
                                    <img style={{width: "100%", height: "100%", objectFit: "contain", opacity: 0.6}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761983824/error-page_lfzrbn.png" />
                                </div>
                                <div style={{fontSize: "20px", paddingTop: "10px"}}>Không tìm thấy thông tin đơn hàng</div>
                            </Col>
                        )
                    }
                    {
                        (!loading && orderDetail) && (
                            <>
                                <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px", paddingBottom: "15px"}}>
                                    <div>Đơn hàng: <span style={{fontWeight: "600"}}>#{orderDetail?.overallData.id}</span></div>
                                    <Circle size={10} fill="#e9e9e9ff" color="#e9e9e9ff" strokeWidth={1} />
                                    <div>Ngày đặt hàng: <span style={{fontWeight: "600"}}>{orderDetail?.overallData.orderDate}</span></div>
                                </Col>
                                <Col span={24} style={{padding: "10px 0px"}}>
                                    {
                                        orderDetail.overallData.status == 1 ? (
                                            <HeaderCancel
                                                order={timeStatus[1]}
                                                cancel={timeStatus[0]}
                                            />
                                        ) : (
                                            <HeaderNormal
                                                order={timeStatus[1]}
                                                transit={timeStatus[2]}
                                                receive={timeStatus[3]}
                                                returnProduct={timeStatus[4]}
                                                currentStatus={orderDetail.overallData.status}
                                                paymentTime={orderDetail.overallData.paymentTime}
                                                paymentMethod={orderDetail.overallData.paymentMethod}
                                            />
                                        )
                                    }
                                </Col>
                                <Col span={12}>
                                    <div style={{backgroundColor: "white", padding: "15px 30px", borderRadius: "20px", border: "1px solid rgba(0, 0, 0, 0.3)", width: "98%"}}>
                                        <div style={{fontSize: "20px", fontWeight: "600", paddingBottom: "10px"}}>Thông tin sản phẩm</div>
                                        <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                                            {
                                                orderDetail.overallData.url.map((item, index) => (
                                                    <Row key={index}>
                                                        <Col span={7}>
                                                            <div style={{width: "90%", height: "150px", overflow: "hidden"}}>
                                                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={item} />
                                                            </div>
                                                        </Col>
                                                        <Col span={17} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                                            <div>
                                                                <div>{orderDetail.overallData.name[index]}</div>
                                                                <div>{orderDetail.overallData.color[index]}/{orderDetail.overallData.size[index]}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                    <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                                                        {
                                                                            orderDetail.overallData.discount[index] > 0 && (
                                                                                <div style={{fontWeight: "600"}}>{`${orderDetail.overallData.discount[index].toLocaleString("en-US")}đ`}</div>
                                                                            )
                                                                        }
                                                                        <div style={orderDetail.overallData.discount[index] > 0 ? {textDecoration: "line-through", fontSize: "14px", color: "#afb6b5"} : {fontWeight: "600"}}>{`${orderDetail.overallData.price[index].toLocaleString("en-US")}đ`}</div>
                                                                    </div>
                                                                    <div>x{orderDetail.overallData.quantity[index]}</div>
                                                                </div>
                                                                {
                                                                    orderDetail.star[index] && (
                                                                        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                                                            <div>Đánh giá của bạn:</div>
                                                                            <div>
                                                                                <RateValue rate={orderDetail.star[index]} size={20}/>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12} style={{display: "flex", justifyContent: "end"}}>
                                    <Row gutter={[0, 20]} style={{width: "98%"}}>
                                        <Col span={24} style={{backgroundColor: "white", padding: "15px 30px", borderRadius: "20px", border: "1px solid rgba(0, 0, 0, 0.3)", height: "fit-content"}}>
                                            <div style={{fontSize: "20px", fontWeight: "600", paddingBottom: "5px"}}>Thông tin giao hàng</div>
                                            <div>
                                                <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600"}}>Tên người nhận:</div>
                                                    <div>{orderDetail.address.name}</div>
                                                </div>
                                                <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600"}}>Số điện thoại:</div>
                                                    <div>{orderDetail.address.phoneNumber}</div>
                                                </div>
                                                <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600", flex: "none", whiteSpace: "nowrap"}}>Địa chỉ:</div>
                                                    <div>
                                                        <div>{orderDetail.address.address.split("=")[0]}</div>
                                                        <div>{orderDetail.address.address.split("=")[1]}</div>
                                                    </div>
                                                </div>
                                                <div style={{padding: "10px 0px", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600"}}>Ghi chú:</div>
                                                    <div>{orderDetail.orderNote ? orderDetail.orderNote : "-"}</div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={24} style={{backgroundColor: "white", padding: "15px 30px", borderRadius: "20px", border: "1px solid rgba(0, 0, 0, 0.3)", height: "fit-content"}}>
                                            <div style={{fontSize: "20px", fontWeight: "600", paddingBottom: "5px"}}>Thông tin thanh toán</div>
                                            <div>
                                                <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600", width: "180px"}}>Tổng tiền sản phẩm:</div>
                                                    <div>
                                                        {`
                                                            ${
                                                                orderDetail.overallData.price.reduce((sum, current, index) => (
                                                                    orderDetail.overallData.discount[index] > 0 ? 
                                                                    sum + orderDetail.overallData.discount[index] * orderDetail.overallData.quantity[index] : 
                                                                    sum + current * orderDetail.overallData.quantity[index]
                                                                ), 0).toLocaleString("en-US")
                                                            }đ
                                                        `}
                                                    </div>
                                                </div>
                                                <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600", width: "180px"}}>Phí vận chuyển:</div>
                                                    <div>{`${orderDetail.shippingFee.toLocaleString("en-US")}đ`}</div>
                                                </div>
                                                {
                                                    orderDetail.shipDiscount > 0 && (
                                                        <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                            <div style={{fontWeight: "600", width: "180px"}}>Giảm giá vận chuyển:</div>
                                                            <div>{`${orderDetail.shipDiscount.toLocaleString("en-US")}đ`}</div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    orderDetail.productDiscount > 0 && (
                                                        <div style={{padding: "10px 0px", borderBottom: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                            <div style={{fontWeight: "600", width: "180px"}}>Giảm giá sản phẩm:</div>
                                                            <div>{`${orderDetail.productDiscount.toLocaleString("en-US")}đ`}</div>
                                                        </div>
                                                    )
                                                }
                                                <div style={{padding: "10px 0px", display: "flex", gap: "10px"}}>
                                                    <div style={{fontWeight: "600", width: "180px"}}>Tổng thanh toán:</div>
                                                    <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                                        <div style={{fontWeight: "600"}}>{`${orderDetail.overallData.total.toLocaleString("en-US")}đ`}</div>
                                                        <div>{`(${orderDetail.paymentStatus == 1 ? "Đã thanh toán" : "Chưa thanh toán"})`}</div>
                                                    </div>
                                                </div>
                                                {
                                                    (orderDetail.overallData.status == 1 || orderDetail.overallData.status == 5) && (
                                                        <div style={{padding: "10px 0px", borderTop: "1px solid rgba(0, 0, 0, 0.5)", display: "flex", gap: "10px"}}>
                                                            <div style={{fontWeight: "600", width: "180px"}}>{`${orderDetail.overallData.status == 1 ? "Lý do hủy đơn:" : "Lý do trả hàng:"}`}</div>
                                                            <div>{`${orderDetail.overallData.status == 1 ? orderDetail.cancelReason : orderDetail.returnReason}`}</div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        )
                    }
                </Row>
                <Row style={{position: "absolute", top: "5px", right: "10px"}}>
                    <Col span={24} style={{display: "flex", justifyContent: "end", gap: "10px", paddingRight: "10px"}}>
                        <X 
                            size={30} 
                            strokeWidth={1} 
                            onClick={() => {
                                setOpen(false);
                                setTimeStatus(["", "", "", "", "", ""])
                            }} 
                            style={{cursor: "pointer"}} 
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default OrderDetailModal;