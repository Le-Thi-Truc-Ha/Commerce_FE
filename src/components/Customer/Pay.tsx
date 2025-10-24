import { Button, Col, ConfigProvider, Input, Radio, Row } from "antd";
import type { JSX } from "react";
import "./Pay.scss";
import { ChevronRight, TicketPercent } from "lucide-react";
import { configProvider } from "../../interfaces/appInterface";

const {TextArea} = Input;

const Pay = (): JSX.Element => {
    const production: {url: string, name: string, price: string, color: string, size: string, quantity: number}[] = [
        {
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101061/pro_den_1_ab9339c762134ec3926d86faaa116493_grande_gtnbcn.jpg",
            name: "Áo sát nách cổ bèo phối ren dây kéo sau",
            price: "395,000₫",
            color: "Hồng",
            size: "L",
            quantity: 1
        }, 
        {
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101060/pro_den_c29ad3a22ed44eed88beb36dfa0ebd60_grande_xdrv3l.jpg",
            name: "Áo blazer dáng crop tay ngắn cài nút",
            price: "535,500₫",
            color: "Da",
            size: "L",
            quantity: 1
        }
    ]
    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
                <Row style={{padding: "30px 200px"}}>
                    <Col span={12} style={{paddingRight: "30px"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                            <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <div style={{fontWeight: "600", fontSize: "20px"}}>Thông tin giao hàng</div>
                                    <div style={{color: "var(--color5)"}}>Chọn địa chỉ khác</div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                    <Input 
                                        className="input-ant"
                                        placeholder="Họ tên"
                                    />
                                    <Input 
                                        className="input-ant"
                                        placeholder="Số điện thoại"
                                    />
                                    <Input 
                                        className="input-ant"
                                        placeholder="Số nhà, tên đường"
                                    />
                                    <Input 
                                        className="input-ant"
                                        placeholder="Phường, Quận, Thành phố"
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "end"}}>
                                    <Button
                                        variant="solid"
                                        color="primary"
                                        size="large"
                                    >
                                        Lưu địa chỉ
                                    </Button>
                                </div>
                            </div>
                            <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                    <div style={{fontWeight: "600", fontSize: "20px"}}>Phương thức thanh toán</div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                    <Radio.Group
                                        style={{display: "flex", flexDirection: "column", gap: "15px"}}
                                        value={1}
                                        options={[
                                            {value: 1, label: "Thanh toán khi nhận hàng"},
                                            {value: 2, label: "Chuyển khoản qua ngân hàng"}
                                        ]}
                                    />
                                </div>
                            </div>
                            <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                    <div style={{fontWeight: "600", fontSize: "20px"}}>Ghi chú đơn hàng</div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                    <TextArea className="input-ant" placeholder="Nội dung ghi chú" autoSize={{minRows: 6}} />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                            <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                    <div style={{fontWeight: "600", fontSize: "20px"}}>Sản phẩm</div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                                    {
                                        production.map((item, index) => (
                                            <Row key={index}>
                                                <Col span={5}>
                                                    <div style={{width: "100%", height: "100px", overflow: "hidden"}}>
                                                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={item.url}/>
                                                    </div>
                                                </Col>
                                                <Col span={19} style={{display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: "20px"}}>
                                                    <div>
                                                        <div>{item.name}</div>
                                                        <div>{item.color} / {item.size}</div>
                                                    </div>
                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                        <div style={{fontWeight: "600"}}>{item.price}</div>
                                                        <div>x{item.quantity}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                </div>
                            </div>
                            <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                    <div style={{fontWeight: "600", fontSize: "20px"}}>Mã khuyến mãi</div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                    <div style={{position: "relative", borderRadius: "20px", padding: "10px 50px", border: "1px solid rgba(0, 0, 0, 0.3)", cursor: "pointer"}}>
                                        <div>Chọn mã</div>
                                        <ChevronRight size={24} strokeWidth={1} style={{position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)"}} />
                                        <TicketPercent size={24} strokeWidth={1} style={{position: "absolute", top: "50%", left: "15px", transform: "translateY(-50%)"}} />
                                    </div>
                                    <div style={{display: "flex", gap: "10px"}}>
                                        <Input 
                                            className="input-ant"
                                            style={{height: "45.6px"}}
                                            placeholder="Nhập mã"
                                        />
                                        <Button
                                            style={{height: "45.6px", borderRadius: "20px"}}
                                            variant="solid"
                                            color="primary"
                                        >
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                    <div style={{fontWeight: "600", fontSize: "20px"}}>Tóm tắt đơn hàng</div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <div>Tổng tiền hàng</div>
                                        <div>930,500₫</div>
                                    </div>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <div>Phí vận chuyển</div>
                                        <div>-</div>
                                    </div>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px"}}>
                                        <div style={{fontWeight: "600"}}>Tổng thanh toán</div>
                                        <div style={{fontWeight: "600"}}>930,500₫</div>
                                    </div>
                                    <div>
                                        <Button
                                            style={{width: "100%"}}
                                            variant="solid"
                                            color="primary"
                                            size="large"
                                        >
                                            Đặt hàng
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    )
}

export default Pay;