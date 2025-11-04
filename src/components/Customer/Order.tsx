import { useContext, useEffect, useRef, useState, type JSX } from "react";
import "./Order.scss";
import { Button, Col, Dropdown, Row, Skeleton, type MenuProps } from "antd";
import { Circle } from "lucide-react";
import FeedbackModal from "../Utilities/Feedback/FeedbackModal";
import type { OrderData } from "../../interfaces/customerInterface";
import { messageService } from "../../interfaces/appInterface";
import { addCart, confirmReceiveProductApi, deleteFeedbackApi, getOrderListApi } from "../../services/customerService";
import { UserContext } from "../../configs/globalVariable";
import { BeatLoader } from "react-spinners";
import OrderDetailModal from "../Utilities/Order/OrderDetailModal";
import dayjs from "dayjs";
import LoadingModal from "../Other/LoadingModal";
import ReasonModal from "../Utilities/Order/ReasonModal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../Utilities/Other/ConfirmDeleteModal";

const Order = (): JSX.Element => {
    const {user, setCart, setPathBeforeLogin} = useContext(UserContext);
    const navigate = useNavigate();
    const nameItem: string[] = ["Chờ xác nhận", "Đang giao hàng", "Đã giao hàng", "Đã hủy", "Trả hàng"]
    const statusOrder: number[] = [2, 3, 4, 1, 5];
        
    const refItem = useRef<(HTMLDivElement | null)[]>([]);
    const parentElement = useRef<(HTMLDivElement | null)>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const [indexOfItem, setIndexOfItem] = useState<number>(1);
    const [position, setPosition] = useState<{xLeft: number | null, width: number | null}>({xLeft: null, width: null})
    const [openFeedback, setOpenFeedback] = useState<boolean>(false);
    const [page, setPage] = useState<number[]>([1, 1, 1, 1, 1]);
    const [orderList, setOrderList] = useState<[OrderData[], OrderData[], OrderData[], OrderData[], OrderData[]]>([[], [], [], [], []])
    const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
    const [hasGet, setHasGet] = useState<boolean>(false);
    const [totalRecord, setTotalRecord] = useState<number[]>([0, 0, 0, 0, 0]);
    const [openOrderDetail, setOpenOrderDetail] = useState<boolean>(false);
    const [orderSelectId, setOrderSelectId] = useState<number>(0);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<number>(0);
    const [openReason, setOpenReason] = useState<boolean>(false);
    const [mode, setMode] = useState<string>("");
    const [feedbackOrderId, setFeedbackOrderId] = useState<number[]>([]);
    const [openDropdown, setOpenDropdown] = useState<{orderId: number, open: boolean}[]>([]);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const feedbackFeature = (orderId: number): MenuProps["items"] => ([
        {
            key: "1",
            label: (
                <div 
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpenFeedback(true);
                        setOrderId(orderId)
                        setMode(feedbackOrderId.includes(orderId) ? "update" : "create")
                    }}
                >
                    Xem đánh giá
                </div>
            )
        },
        {
            key: "2",
            label: (
                <div
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpenDropdown((prev) => (prev.map((item) => (item.orderId == orderId ? {...item, open: false} : item))))
                        setOpenDeleteConfirm(true);
                        setOrderId(orderId);
                    }}
                >
                    Xóa đánh giá
                </div>
            )
        }
    ])

    useEffect(() => {
        if (openFeedback) {
            setOpenDropdown((prev) => (
                prev.map((item) => ({...item, open: false}))
            ))
        }
    }, [openFeedback])

    useEffect(() => {
        getPositionItem();
    }, [indexOfItem]);

    const getPositionItem = () => {
        const parentRect = parentElement.current?.getBoundingClientRect();
        const rect = refItem.current[indexOfItem - 1]?.getBoundingClientRect();
        setPosition({
            xLeft: rect && parentRect ? (rect?.left - parentRect?.left) : null,
            width: rect?.width ?? null
        })
    }

    const getOrderList = async () => {
        setGetDataLoading(true);
        try {
            const status = [statusOrder[indexOfItem - 1]]
            if (status[0] == 4) {
                status.push(6);
            }
            const result = await getOrderListApi(user.accountId, status, page[indexOfItem - 1]);
            if (result.code == 0) {
                const changeType = result.data.order.map((item: any) => (
                    {
                        ...item, 
                        statusHistory: (item.statusHistory ?? []).map((itemChild: any) => (
                            {
                                id: itemChild.id,
                                status: itemChild.status ?? -1,
                                date: dayjs(itemChild.date)
                            }
                        ))
                    }
                ))
                setOrderList((prev) => {
                    const newList = [...prev];
                    newList[indexOfItem - 1] = [...newList[indexOfItem - 1], ...changeType];
                    return newList as [OrderData[], OrderData[], OrderData[], OrderData[], OrderData[]]
                })

                setFeedbackOrderId((prev) => (
                    [
                        ...prev, 
                        ...changeType.map((item: OrderData) => (
                            item.feedback ? item.id : null
                        )).filter(Boolean)
                    ]
                ))

                if (indexOfItem == 3) {
                    setOpenDropdown((prev) => (
                        [
                            ...prev,
                            ...changeType.map((item: OrderData) => (
                                {orderId: item.id, openDropdown: false}
                            ))
                        ]
                    ))
                }

                if (page[indexOfItem - 1] == 1) {
                    setTotalRecord((prev) => (
                        prev.map((item, index) => (index == indexOfItem - 1 ? result.data.count : item))
                    ))
                    setPage((prev) => (
                        prev.map((item, index) => (index == indexOfItem - 1 ? item + 1 : item))
                    ))
                }
            } else {
                messageService.error(result.message)
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetDataLoading(false);
        }
    }

    useEffect(() => {
        if (page[indexOfItem - 1] == 1) {
            getOrderList()
        }
        if (hasGet) {
            setHasGet(false)
            if (orderList[indexOfItem - 1].length < totalRecord[indexOfItem - 1]) {
                getOrderList()
            }
            
        }
    }, [page[indexOfItem - 1], indexOfItem])

    useEffect(() => {
        if (getDataLoading) {
            return
        }

        const isShortList = document.body.scrollHeight <= window.innerHeight;
        const observer = new IntersectionObserver(async (entries) => {
            const shouldLoad = entries[0].isIntersecting || isShortList;
            if (
                shouldLoad && 
                !hasGet && 
                !getDataLoading && 
                orderList[indexOfItem - 1].length < totalRecord[indexOfItem - 1] &&
                orderList[indexOfItem - 1].length > 0
            ) {
                setHasGet(true)
                if (page[indexOfItem - 1] == 2) {
                    await getOrderList()
                }
                setPage((prev) => (
                    prev.map((item, index) => (index == indexOfItem - 1 ? item + 1 : item))
                ))
            }
        })
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            observer.disconnect()
        }
    }, [getDataLoading, indexOfItem, orderList, totalRecord, hasGet])

    const confirmReceiveProduct = async (orderId: number) => {
        setModalLoading(true)
        try {
            const result = await confirmReceiveProductApi(orderId, dayjs().toISOString());
            if (result.code == 0) {
                setOrderList((prev) => (
                    prev.map((item, index) => (
                        index != indexOfItem - 1 ? item : item.map((itemChild) => (
                            itemChild.id == orderId ? {...itemChild, status: 6} : itemChild
                        ))
                    )) as [OrderData[], OrderData[], OrderData[], OrderData[], OrderData[]]
                ))
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setModalLoading(false);
        }
    }

    const buyAgain = async (orderId: number) => {
        try {
            const order = orderList[indexOfItem - 1].find((item) => (item.id == orderId));
            const sizeSelect = order?.size ?? [];
            const colorSelect = order?.color ?? [];
            const productVariantId = order?.productVariantId ?? [];
            const quantity = order?.quantity ?? [];
            const productId = order?.productId ?? [];
            await addCart(user, sizeSelect, colorSelect, productVariantId, quantity, productId, setCart, setPathBeforeLogin, navigate, setModalLoading, dayjs().toISOString(), true)
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        }
    }

    const deleteFeedback = async () => {
        setDeleteLoading(true);
        try {
            const productIds = orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.productId
            const result = await deleteFeedbackApi(orderId, productIds ?? []);
            if (result.code == 0) {
                setFeedbackOrderId((prev) => (prev.filter((item) => (item != orderId))));
                setOpenDeleteConfirm(false)
                messageService.success(result.message);
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setDeleteLoading(false)
        }
    }

    return(
        <>
            <Row className="order-container">
                <Col span={24} style={{minHeight: "calc(100vh - 130px)"}}>
                    <Row>
                        <Col span={24} style={{paddingBottom: "20px"}}>
                            <div>
                                <Col span={24} style={{display: "flex", justifyContent: "center", gap: "35px"}} ref={parentElement}>
                                    {
                                        nameItem.map((item, index) => (
                                            <div 
                                                key={index} 
                                                style={{fontSize: "20px", cursor: "pointer"}}
                                                ref={(element) => {refItem.current[index] = element}}
                                                onClick={() => {
                                                    setIndexOfItem(index + 1);
                                                    setPage([1, 1, 1, 1, 1])
                                                    setOrderList([[], [], [], [], []])
                                                    setTotalRecord([0, 0, 0, 0, 0])
                                                    setFeedbackOrderId([])
                                                }}
                                            >
                                                {item}
                                            </div>
                                        ))
                                    }
                                </Col>
                                <Col span={24} style={{paddingTop: "8px", position: "relative"}}>
                                    <div style={{width: "100%", height: "1px", backgroundColor: "rgba(0, 0, 0, 0.2)"}}></div>
                                    <div className="item-underline" style={{width: `${position.width}px`, left: `${position.xLeft}px`}}></div>
                                </Col>
                            </div>
                        </Col>
                        {
                            (getDataLoading && page[indexOfItem - 1] == 1) ? (
                                <Skeleton active paragraph={{rows: 10}} />
                            ) : (
                                <>
                                    <Col span={24} style={{display: "flex", flexDirection: "column", gap: "20px", position: "relative"}}>
                                        {
                                            orderList[indexOfItem - 1].length > 0 ? orderList[indexOfItem - 1].map((item, index) => (
                                                <Row 
                                                    key={index} 
                                                    style={{border: "1px solid rgba(0, 0, 0, 0.3)", padding: "20px 20px", borderRadius: "20px", cursor: "pointer"}}
                                                    onClick={() => {
                                                        setOpenOrderDetail(true);
                                                        setOrderSelectId(item.id)
                                                    }}
                                                >
                                                    <Col span={12}>
                                                        <Row>
                                                            <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px", paddingBottom: "15px"}}>
                                                                <div>Đơn hàng: <span style={{fontWeight: "600"}}>#{item.id}</span></div>
                                                                <Circle size={10} fill="#e9e9e9ff" color="#e9e9e9ff" strokeWidth={1} />
                                                                <div>Ngày đặt hàng: <span style={{fontWeight: "600"}}>{item.orderDate}</span></div>
                                                            </Col>
                                                            <Col span={24} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                                                                {
                                                                    item.url.map((childrenItem, childrenIndex) => (
                                                                        <Row key={childrenIndex}>
                                                                            <Col span={7}>
                                                                                <div style={{width: "90%", height: "150px", overflow: "hidden"}}>
                                                                                    <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={childrenItem} />
                                                                                </div>
                                                                            </Col>
                                                                            <Col span={17} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                                                                <div>
                                                                                    <div>{item.name[childrenIndex]}</div>
                                                                                    <div>{item.color[childrenIndex]} / {item.size[childrenIndex]}</div>
                                                                                </div>
                                                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                                                                        {
                                                                                            item.discount[childrenIndex] > 0 && (
                                                                                                <div style={{fontWeight: "600"}}>{`${item.discount[childrenIndex].toLocaleString("en-US")}đ`}</div>
                                                                                            )
                                                                                        }
                                                                                        <div style={item.discount[childrenIndex] > 0 ? {textDecoration: "line-through", color: "#afb6b5"} : {fontWeight: "600"}}>{`${item.price[childrenIndex].toLocaleString("en-US")}đ`}</div>
                                                                                    </div>
                                                                                    <div>x{item.quantity[childrenIndex]}</div>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                }
                                                            </Col>
                                                            <Col span={24} style={{paddingTop: "15px"}}>
                                                                <Row style={{width: "100%"}}>
                                                                    {
                                                                        indexOfItem == 3 && (
                                                                            <Col span={12}>
                                                                                <div style={{fontSize: "14px", color: "#8d8d8dff"}}>{`Trả hàng trước ${item.statusHistory.find((i) => (i.status == 4))?.date.add(7, "day").format("DD/MM/YYYY")}`}</div>
                                                                                <div style={{fontSize: "14px", color: "#8d8d8dff"}}>{`Đánh giá trước ${item.statusHistory.find((i) => (i.status == 4))?.date.add(30, "day").format("DD/MM/YYYY")}`}</div>
                                                                            </Col>
                                                                        )
                                                                    }
                                                                    <Col span={indexOfItem == 3 ? 12 : 24} style={{display: "flex", justifyContent: "end"}}>
                                                                        <div style={{fontSize: "20px"}}>Tổng thanh toán: <span style={{fontSize: "20px", fontWeight: "600"}}>{`${item.total.toLocaleString("en-US")}đ`}</span></div>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={12} style={{padding: "0px 100px"}}>
                                                        <div style={{textAlign: "center", fontSize: "18px", fontWeight: "600", paddingBottom: "20px"}}>Trạng thái đơn hàng</div>
                                                        {
                                                            item.status == 2 && (
                                                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày đặt hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 2))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 1 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày giao hàng:</div>
                                                                        <div>-</div>
                                                                    </div>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày nhận hàng:</div>
                                                                        <div>-</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 2 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div>
                                                                        <Button
                                                                            variant="solid"
                                                                            color="primary"
                                                                            size="large"
                                                                            style={{width: "100%"}}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                setOrderId(item.id);
                                                                                setOpenReason(true);
                                                                                setMode("cancel");

                                                                            }}
                                                                        >
                                                                            Hủy đơn hàng
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            item.status == 3 && (
                                                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày đặt hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 2))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 1 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày giao hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 3))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày nhận hàng:</div>
                                                                        <div>-</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 2 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            (item.status == 4 || item.status == 6) && (
                                                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày đặt hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 2))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 1 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày giao hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 3))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày nhận hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 4))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 2 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.status == 4 ? (
                                                                            <>
                                                                                <div style={{display: "flex"}}>
                                                                                    <Button
                                                                                        variant="solid"
                                                                                        color="primary"
                                                                                        size="large"
                                                                                        style={{width: "100%"}}
                                                                                        onClick={(event) => {
                                                                                            event.stopPropagation();
                                                                                            confirmReceiveProduct(item.id)
                                                                                        }}
                                                                                    >
                                                                                        Đã nhận hàng
                                                                                    </Button>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div style={{display: "flex", gap: "30px"}}>
                                                                                {
                                                                                    dayjs().isSameOrBefore(item.statusHistory.find((i) => (i.status == 4))?.date.add(30, "day")) && (
                                                                                        <Dropdown
                                                                                            menu={{items: feedbackFeature(item.id), style: {width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}}
                                                                                            placement="bottom"
                                                                                            arrow
                                                                                            open={!feedbackOrderId.includes(item.id) ? false : openDropdown.find((i) => (i.orderId == item.id))?.open}
                                                                                            onOpenChange={(flag) => setOpenDropdown((prev) => (prev.map((i) => (i.orderId == item.id ? {...i, open: flag} : i))))}
                                                                                        >
                                                                                            <Button
                                                                                                variant="solid"
                                                                                                color="primary"
                                                                                                size="large"
                                                                                                style={{width: "100%"}}
                                                                                                onClick={(event) => {
                                                                                                    event.stopPropagation();
                                                                                                    if (feedbackOrderId.includes(item.id)) {
                                                                                                        setOpenDropdown((prev) => (prev.map((i) => (i.orderId == item.id ? {...i, open: true} : i))));
                                                                                                    } else {
                                                                                                        setOpenFeedback(true);
                                                                                                        setOrderId(item.id)
                                                                                                        setMode("create")
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                Đánh giá
                                                                                            </Button>
                                                                                        </Dropdown>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    dayjs().isSameOrBefore(item.statusHistory.find((i) => (i.status == 4))?.date.add(7, "day")) && (
                                                                                        <Button
                                                                                            variant="solid"
                                                                                            color="primary"
                                                                                            size="large"
                                                                                            style={{width: "100%"}}
                                                                                            onClick={(event) => {
                                                                                                event.stopPropagation();
                                                                                                setOrderId(item.id);
                                                                                                setOpenReason(true);
                                                                                                setMode("return")
                                                                                            }}
                                                                                        >
                                                                                            Trả hàng
                                                                                        </Button>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            item.status == 1 && (
                                                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày đặt hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 2))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 1 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày hủy đơn:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 1))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    <div style={{display: "flex", gap: "30px"}}>
                                                                        <Button
                                                                            variant="solid"
                                                                            color="primary"
                                                                            size="large"
                                                                            style={{width: "100%"}}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                buyAgain(item.id);
                                                                            }}
                                                                        >
                                                                            Mua lại
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            item.status == 5 && (
                                                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày đặt hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 2))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 1 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày giao hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 3))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày nhận hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 4))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    {
                                                                        item.paymentMethod == 2 && (
                                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                                <div>Ngày thanh toán:</div>
                                                                                <div>{item.paymentTime ? item.paymentTime : "-"}</div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                        <div>Ngày trả hàng:</div>
                                                                        <div>{item.statusHistory.find((itemChild) => (itemChild.status == 5))?.date.format("DD/MM/YYYY HH:mm") ?? "-"}</div>
                                                                    </div>
                                                                    <div style={{display: "flex", gap: "30px"}}>
                                                                        <Button
                                                                            variant="solid"
                                                                            color="primary"
                                                                            size="large"
                                                                            style={{width: "100%"}}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                buyAgain(item.id);
                                                                            }}
                                                                        >
                                                                            Mua lại
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", right: "50%", top: "50%", transform: "translate(50%, 50%)"}}>
                                                    <div style={{width: "300px", height: "300px", overflow: "hidden"}}>
                                                        <img style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "blur(3px)"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761896035/order_ayqqfl.png" />
                                                    </div>
                                                    <div style={{fontSize: "20px", opacity: 0.5}}>Chưa có đơn hàng</div>
                                                </div>
                                            )
                                        }
                                    </Col>
                                    <Col span={24}>
                                        <div ref={loaderRef} style={{height: "1px"}}></div>
                                    </Col>
                                </>
                            )
                        }
                        
                        {
                            (getDataLoading && page[indexOfItem - 1] != 1) && (
                                <Col span={24} style={{paddingTop: "10px", display: "flex", justifyContent: "center"}}>
                                    <BeatLoader 
                                        color="var(--color7)"
                                        loading={getDataLoading}
                                        size={10}
                                    />
                                </Col>
                            )
                        }
                    </Row>
                </Col>
                <FeedbackModal
                    openModal={openFeedback}
                    setOpenModal={setOpenFeedback}
                    size={orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.size ?? []}
                    color={orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.color ?? []}
                    name={orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.name ?? []}
                    productVariantId={orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.productVariantId ?? []}
                    url={orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.url ?? []}
                    productId={orderList[indexOfItem - 1].find((item) => (item.id == orderId))?.productId ?? []}
                    orderId={orderId}
                    setFeedbackOrderId={setFeedbackOrderId}
                    mode={mode}
                />
                <OrderDetailModal 
                    open={openOrderDetail}
                    setOpen={setOpenOrderDetail}
                    orderId={orderSelectId}
                />
                <LoadingModal 
                    open={modalLoading || deleteLoading}
                    message={`${modalLoading ? "Đang lưu" : "Đang xóa"}`}
                />
                <ReasonModal
                    open={openReason}
                    setOpen={setOpenReason}
                    orderId={orderId}
                    mode={mode}
                    indexOfItem={indexOfItem} 
                    totalRecord={totalRecord}
                    setTotalRecord={setTotalRecord}
                    page={page}
                    setPage={setPage}
                    orderList={orderList}
                    setOrderList={setOrderList}
                />
                <ConfirmDeleteModal
                    open={openDeleteConfirm}
                    title="Xác nhận xóa đánh giá"
                    okText="Xóa"
                    content="Bạn chắc chắn muốn xóa đánh giá của đơn hàng này?"
                    handleCancel={() => {setOpenDeleteConfirm(false)}}
                    handleOk={deleteFeedback}
                />
            </Row>
        </>
    )
}

export default Order;