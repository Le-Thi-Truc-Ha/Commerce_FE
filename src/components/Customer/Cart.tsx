import { Button, Checkbox, Col, ConfigProvider, Divider, Row } from "antd";
import { Minus, Plus, Trash } from "lucide-react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

const Cart = (): JSX.Element => {
    const navigate = useNavigate();
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
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101057/pro_kem_01_1_9ed6ccd6f96c4feebe79bd73d80eef16_grande_jvn1p0.jpg",
            name: "Áo khoác ren lớp nắp túi",
            price: "555,000₫",
            color: "Nâu",
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
            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            borderRadius: 20,
                            activeBorderColor: "var(--color6)",
                            activeShadow: "0 0 0 2px var(--color2)",
                            hoverBorderColor: "var(--color4)",
                        },
                        DatePicker: {
                            borderRadius: 20,
                            activeBorderColor: "var(--color6)",
                            activeShadow: "0 0 0 2px var(--color2)",
                            hoverBorderColor: "var(--color4)",
                        },
                        Select: {
                            borderRadius: 20,
                            activeBorderColor: "var(--color6)",
                            activeOutlineColor: "var(--color2)",
                            hoverBorderColor: "var(--color4)",
                            optionActiveBg: "var(--color2)",
                            controlItemBgActive: "var(--color4)"
                        },
                        Button: {
                            defaultActiveBorderColor: "var(--color7)",
                            defaultActiveColor: "var(--color7)",
                            defaultHoverBorderColor: "var(--color6)",
                            defaultHoverColor: "var(--color6)",
                            defaultShadow: "0 0 0 black",

                            colorPrimary: "var(--color5)",
                            colorPrimaryActive: "var(--color6)",
                            colorPrimaryHover: "var(--color4)",
                            primaryShadow: "0 0 0 black",
                            colorPrimaryTextHover: "var(--color4)",
                            colorPrimaryTextActive: "var(--color6)"
                        },
                        Checkbox: {
                            colorPrimary: "var(--color7)",
                            colorPrimaryHover: "var(--color6)"
                        },
                        Divider: {
                            colorSplit: "rgba(0, 0, 0, 0.5)",
                        }
                    }
                }}
            >
                <Row className="cart-container" style={{padding: "30px 40px"}}>
                    <Col span={24} style={{paddingBottom: "30px"}}>
                        <div style={{fontFamily: "Prata", fontSize: "30px", textAlign: "center"}}>Giỏ hàng</div>
                    </Col>
                    <Col span={18} style={{display: "flex", flexDirection: "column", gap: "60px"}}>
                        {
                            production.map((item, index) => (
                                <Row key={index} style={{width: "100%", display: "flex", alignItems: "center"}}>
                                    <Col span={1}>
                                        <Checkbox checked={index == 0 || index == 2} />
                                    </Col>
                                    <Col span={7}>
                                        <div style={{width: "100%", height: "300px", overflow: "hidden"}}>
                                            <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={item.url} />
                                        </div>
                                    </Col>
                                    <Col span={11} style={{paddingLeft: "50px"}}>
                                        <div style={{display: "flex", flexDirection: "column", alignItems: "start", gap: "20px"}}>
                                            <div style={{fontSize: "20px"}}>{item.name}</div>
                                            <div style={{border: "1px solid var(--color7)", padding: "5px 10px", borderRadius: "20px"}}>{item.color} / {item.size}</div>
                                            <div style={{fontSize: "20px"}}>{item.price}</div>
                                        </div>
                                    </Col>
                                    <Col span={5} style={{display: "flex", alignItems: "center", gap: "20px", justifyContent: "center"}}>
                                        <div style={{display: "flex", alignItems: "center", gap: "30px"}}>
                                            <div style={{padding: "2px", backgroundColor: "var(--color6)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                <Minus size={20} strokeWidth={1} color="white" />
                                            </div>
                                            <div style={{fontSize: "20px"}}>{item.quantity}</div>
                                            <div style={{padding: "2px", backgroundColor: "var(--color6)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                <Plus size={20} strokeWidth={1} color="white" />
                                            </div>
                                        </div>
                                        <Trash size={24} strokeWidth={1} />
                                    </Col>
                                </Row>
                            ))
                        }
                    </Col>
                    <Col span={6} style={{position: "sticky", top: "100px", alignSelf: "start"}}>
                        <div style={{padding: "20px", backgroundColor: "white"}}>
                            <div style={{fontFamily: "Prata", fontSize: "25px"}}>Đơn hàng</div>
                            <Divider size="small" />
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div style={{fontSize: "20px"}}>2 sản phẩm</div>
                                <div style={{fontSize: "20px"}}>930,500₫</div>
                            </div>
                        </div>
                        <Button
                            style={{width: "100%", marginTop: "10px", borderRadius: "0px"}}
                            size="large"
                            variant="solid"
                            color="primary"
                            onClick={() => {navigate("/customer/pay")}}
                        >
                            Đặt hàng
                        </Button>
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    )
}

export default Cart;