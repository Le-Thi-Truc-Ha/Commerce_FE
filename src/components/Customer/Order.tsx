import { useEffect, useRef, useState, type JSX } from "react";
import "./Order.scss";
import { Button, Col, Row } from "antd";
import { Circle } from "lucide-react";
import FeedbackModal from "../Utilities/Feedback/FeedbackModal";

const Order = (): JSX.Element => {
    const nameItem: string[] = ["Chờ xác nhận", "Đang giao hàng", "Đã giao hàng", "Đã hủy", "Trả hàng"]
        
    const refItem = useRef<(HTMLDivElement | null)[]>([]);
    const parentElement = useRef<(HTMLDivElement | null)>(null);
    const [indexOfItem, setIndexOfItem] = useState<number>(1);
    const [position, setPosition] = useState<{xLeft: number | null, width: number | null}>({xLeft: null, width: null})
    const [openFeedback, setOpenFeedback] = useState<boolean>(false);

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

    const orderList: {status: number, id: number, orderDate: string, url: string[], name: string[], price: string[], size: string[], color: string[], quantity: number[], total: string}[] = [
        {
            status: 0,
            id: 4,
            orderDate: "11/10/2025",
            url: [
                "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031339/pro_trang_2_4c261b702dd74bf58325a21830e364ce_grande_nyfzhr.jpg",
                "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031343/pro_hoa_01_1_6cb772274f3544d989e5014291f40455_grande_ptdi0v.jpg"
            ],
            name: [
                "Áo kiểu tay ngắn cổ sơ mi phối ren",
                "Đầm mini 2 dây thêu hoa form suông phối bèo"
            ],
            price: [
                "177,500₫", "556,000₫"
            ],
            size: [
                "L", "L"
            ],
            color: [
                "Trắng", "Đen"
            ],
            quantity: [1, 1],
            total: "733,500₫"
        },
        {
            status: 2,
            id: 2,
            orderDate: "07/09/2025",
            url: [
                "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031345/pro_luc_01_1_0af140c6cd3c4058b97970c80993d8c7_grande_dfmcdb.jpg"
            ],
            name: [
                "Đầm midi form suông sát nách thắt nơ lưng"
            ],
            price: [
                "476,000₫"
            ],
            size: [
                "L"
            ],
            color: [
                "Xanh"
            ],
            quantity: [1, 1],
            total: "476,000₫"
        },
        {
            status: 2,
            id: 1,
            orderDate: "05/09/2025",
            url: [
                "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031355/pro_nau_01_4_adef39546c694d7eb19d9eb2ab1ba7db_grande_rgn2y5.jpg",
                "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034352/pro_trang_4_6188e6cde05c40ce98f7e65c19fc7011_grande_w0byvi.jpg"
            ],
            name: [
                "Áo thun crop tay ngắn cổ V cài nút",
                "Váy skort cơ bản kẻ sọc"
            ],
            price: [
                "153,000₫", "213,000₫"
            ],
            size: [
                "L", "L"
            ],
            color: [
                "Nâu", "Trắng"
            ],
            quantity: [1, 1],
            total: "366,000₫"
        },
        {
            status: 3,
            id: 3,
            orderDate: "05/10/2025",
            url: [
                "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034359/pro_den_3_b8bbfb2ca9eb4ec1979f93041d65a3dd_grande_nye8yu.jpg"
            ],
            name: [
                "Quần culotte xếp li hông"
            ],
            price: [
                "364,000₫"
            ],
            size: [
                "L"
            ],
            color: [
                "Trắng"
            ],
            quantity: [1, 1],
            total: "364,000₫"
        }
    ]
    const orderStatus: {id: number, confirm: string | null, transit: string  | null, receive: string  | null, cancel: string  | null, return: string | null}[] = [
        {
            id: 1,
            confirm: "05/09/2025",
            transit: "06/09/2025",
            receive: "09/09/2025",
            cancel: null,
            return: null
        },
        {
            id: 2,
            confirm: "08/09/2025",
            transit: "08/09/2025",
            receive: "12/09/2025",
            cancel: null,
            return: null
        },
        {
            id: 3,
            confirm: null,
            transit: null,
            receive: null,
            cancel: "05/10/2025",
            return: null
        },
        {
            id: 4,
            confirm: null,
            transit: null,
            receive: null,
            cancel: null,
            return: null
        }
    ]
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
                                                onClick={() => {setIndexOfItem(index + 1)}}
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
                        <Col span={24} style={{display: "flex", flexDirection: "column", gap: "20px", position: "relative"}}>
                            {
                                orderList.filter((item) => (item.status == indexOfItem - 1)).length > 0 ? orderList.map((parentItem, parentIndex) => parentItem.status == indexOfItem - 1 && (
                                    <Row key={parentIndex} style={{border: "1px solid rgba(0, 0, 0, 0.3)", padding: "10px 20px", borderRadius: "20px", cursor: "pointer"}}>
                                        <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px", paddingBottom: "15px"}}>
                                            <div>Đơn hàng: <span style={{fontWeight: "600"}}>#{parentItem.id}</span></div>
                                            <Circle size={10} fill="#e9e9e9ff" color="#e9e9e9ff" strokeWidth={1} />
                                            <div>Ngày đặt hàng: <span style={{fontWeight: "600"}}>{parentItem.orderDate}</span></div>
                                        </Col>
                                        <Col span={12} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                                            {
                                                parentItem.url.map((childrenItem, childrenIndex) => (
                                                    <Row key={childrenIndex}>
                                                        <Col span={8}>
                                                            <div style={{width: "100%", height: "200px", overflow: "hidden"}}>
                                                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={childrenItem} />
                                                            </div>
                                                        </Col>
                                                        <Col span={16} style={{display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: "20px"}}>
                                                            <div>
                                                                <div>{parentItem.name[childrenIndex]}</div>
                                                                <div>{parentItem.color[childrenIndex]} / {parentItem.size[childrenIndex]}</div>
                                                            </div>
                                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                                <div style={{fontWeight: "600"}}>{parentItem.price[childrenIndex]}</div>
                                                                <div>x{parentItem.quantity[childrenIndex]}</div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </Col>
                                        <Col span={12} style={{padding: "0px 100px"}}>
                                            <div style={{textAlign: "center", fontSize: "18px", fontWeight: "600", paddingBottom: "20px"}}>Trạng thái đơn hàng</div>
                                            {
                                                parentItem.status == 0 && (
                                                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày xác nhận:</div>
                                                            <div>-</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày giao hàng:</div>
                                                            <div>-</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày nhận hàng:</div>
                                                            <div>-</div>
                                                        </div>
                                                        <div>
                                                            <Button
                                                                variant="solid"
                                                                color="primary"
                                                                size="large"
                                                                style={{width: "100%"}}
                                                            >
                                                                Hủy đơn hàng
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                parentItem.status == 1 && (
                                                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày xác nhận:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.confirm}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày giao hàng:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.transit}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày nhận hàng:</div>
                                                            <div>-</div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                parentItem.status == 2 && (
                                                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày xác nhận:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.confirm}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày giao hàng:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.transit}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày nhận hàng:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.receive}</div>
                                                        </div>
                                                        <div style={{display: "flex", gap: "30px"}}>
                                                            <Button
                                                                variant="solid"
                                                                color="primary"
                                                                size="large"
                                                                style={{width: "100%"}}
                                                                onClick={() => {
                                                                    setOpenFeedback(true);
                                                                }}
                                                            >
                                                                Đánh giá
                                                            </Button>
                                                            <Button
                                                                variant="solid"
                                                                color="primary"
                                                                size="large"
                                                                style={{width: "100%"}}
                                                            >
                                                                Trả hàng
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                parentItem.status == 3 && (
                                                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày hủy đơn:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.cancel}</div>
                                                        </div>
                                                        <div style={{display: "flex", gap: "30px"}}>
                                                            <Button
                                                                variant="solid"
                                                                color="primary"
                                                                size="large"
                                                                style={{width: "100%"}}
                                                            >
                                                                Mua lại
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                parentItem.status == 4 && (
                                                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày xác nhận:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.confirm}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày giao hàng:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.transit}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày nhận hàng:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.receive}</div>
                                                        </div>
                                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                                            <div>Ngày trả hàng:</div>
                                                            <div>{orderStatus.find((itemFind) => (itemFind.id == parentItem.id))?.return}</div>
                                                        </div>
                                                        <div style={{display: "flex", gap: "30px"}}>
                                                            <Button
                                                                variant="solid"
                                                                color="primary"
                                                                size="large"
                                                                style={{width: "100%"}}
                                                            >
                                                                Mua lại
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </Col>
                                        <Col span={12} style={{paddingTop: "15px", display: "flex", justifyContent: "end"}}>
                                            <div style={{fontSize: "20px"}}>Tổng thanh toán: <span style={{fontSize: "20px", fontWeight: "600"}}>{parentItem.total}</span></div>
                                        </Col>
                                    </Row>
                                )) : (
                                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", right: "50%", top: "50%", transform: "translate(50%, 50%)"}}>
                                        <div style={{width: "300px", height: "300px", overflow: "hidden"}}>
                                            <img style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "blur(3px)"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1760129523/no-data_q4r0yj.png" />
                                        </div>
                                        <div style={{fontSize: "20px", opacity: 0.5}}>Chưa có đơn hàng</div>
                                    </div>
                                )
                            }
                        </Col>
                    </Row>
                </Col>
                <FeedbackModal
                    openModal={openFeedback}
                    setOpenModal={setOpenFeedback}
                />
            </Row>
        </>
    )
}

export default Order;