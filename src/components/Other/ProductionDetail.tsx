import { Button, Col, ConfigProvider, Row } from "antd";
import { ChevronDown, ChevronUp, Heart, Minus, PencilLine, Plus, Star } from "lucide-react";
import { useState, type JSX } from "react";
import "./ProductionDetail.scss";
import { AnimatePresence } from "framer-motion";
import { divConfig, MotionDiv } from "../../interfaces/appInterface";

const RateValue = ({rate, size}: {rate: number, size: number}): JSX.Element => {
    const rateString = rate.toFixed(1);
    const integerPart = rateString.split(".")[0];
    const fractionalPart = rateString.split(".")[1];
    return(
        <>
            <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
                <div style={{display: "flex", gap: "5px"}}>
                    {
                        [...Array(5)].map((_, index) => (
                            <Star key={index} size={size} stroke="none" fill="#dededeff" />
                        ))
                    }
                </div>
                <div style={{display: "flex", gap: "5px", position: "absolute"}}>
                    {
                        [...Array(5)].map((_, index) => (
                            <Star key={index} size={size} stroke="none" fill={`${index >= 0 && index <= Number(integerPart) ? "#fadb14" : "#dededeff"}`} style={{clipPath: `${index == Number(integerPart) ? `inset(0 ${100 - Number(fractionalPart) * 10}% 0 0)` : ""}`}} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}
const ProductionDetail = (): JSX.Element => {
    const [imageSelect, setImageSelect] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);
    const imageUrl: string[] = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178714/pro_kem_01_2_ed0211ef1f1f4d6a83b4fe9971e89f74_master_ulpqci.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178696/pro_kem_01_1_9ed6ccd6f96c4feebe79bd73d80eef16_master_kjup1l.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178730/pro_kem_01_3_52abea931b124b33af0a04ec2f128aa3_master_dgh6v3.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178744/pro_kem_01_4_8da414ee6c2b4a449f34a4a3c4a239d7_master_o6yxkn.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178761/1_zfjsmq.webp",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178762/2_h5weoi.webp",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760178764/3_agmq1a.webp"
    ]
    const productionInformation: {name: string, price: string, color: string[], size: string[], description: string, preservation: string} = {
        name: "Áo khoác ren thun phối bèo đính nơ",
        price: "425,000₫",
        color: ["Kem", "Nâu"],
        size: ["S", "M", "L", "XL"],
        description: "Chưa có mô tả cho sản phẩm này",
        preservation: `- Giặt tay để tránh bay màu hoặc xù lông, ủi nhiệt độ bình thường.
                       - Không vắt hoặc xoắn mạnh vì điều này có thể gây ra các nếp nhăn và ảnh hưởng đến độ bền, cấu trúc của vải.
                       - Phơi, ủi mặt trái sản phẩm.`
    }
    const feedbackList: {name: string, rate: number, content: string}[] = [
        {
            name: "n2*****3",
            rate: 4,
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi explicabo nam voluptatem sed, ipsum pariatur aliquid laboriosam, aspernatur consequuntur tenetur, delectus eum! Voluptas maiores, cumque perferendis laborum quasi commodi ipsum."
        },
        {
            name: "di*****6",
            rate: 5,
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi explicabo nam voluptatem sed, ipsum pariatur aliquid laboriosam, aspernatur consequuntur tenetur, delectus eum! Voluptas maiores, cumque perferendis laborum quasi commodi ipsum."
        },
        {
            name: "le******6",
            rate: 4,
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi explicabo nam voluptatem sed, ipsum pariatur aliquid laboriosam, aspernatur consequuntur tenetur, delectus eum! Voluptas maiores, cumque perferendis laborum quasi commodi ipsum."
        }
    ]
    const optionFiler: string[] = ["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"]
    const optionFilter1: string[] = ["Tất cả", "5 sao", "4 sao"]
    const optionFilter2: string[] = ["3 sao", "2 sao", "1 sao"]

    const moveUp = () => {
        const newValue = startIndex + 1;
        if (newValue + 4 > imageUrl.length) {
            return;
        } else {
            setStartIndex(newValue);
        }
    }

    const moveDown = () => {
        const newValue = startIndex - 1;
        if (newValue < 0) {
            return;
        } else {
            setStartIndex(newValue);
        }
    }

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
                        },
                        Radio: {
                            colorPrimaryActive: "var(--color7)",
                            colorPrimary: "var(--color6)",
                            colorPrimaryHover: "var(--color5)",
                            colorPrimaryBorder: "var(--color8)"
                        }
                    }
                }}
            >
                <Row style={{padding: "30px 200px"}} className="production-detail-container">
                    <Col span={24} style={{padding: "20px", backgroundColor: "white", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)", position: "relative"}}>
                        <Row align={"middle"}>
                            <Col span={12}>
                                <Row align={"middle"}>
                                    <Col span={6} style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
                                        <div>
                                            <ChevronUp size={24} strokeWidth={1} color={`${startIndex == 0 ? "white" : "black"}`} style={{cursor: `${startIndex == 0 ? "default" : "pointer"}`}} onClick={() => {moveDown()}} />
                                        </div>
                                        <div
                                            style={{position: "relative", height: "460px", overflow: "hidden"}}
                                        >
                                            <MotionDiv
                                                animate={{y: -startIndex * 120}}
                                                transition={{type: "spring", stiffness: 80, damping: 15}}
                                                style={{display: "flex", flexDirection: "column", gap: "20px"}}
                                            >
                                                {
                                                    imageUrl.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className={`image-item ${imageSelect === index ? "image-active" : ""}`}
                                                            onClick={() => setImageSelect(index)}
                                                            style={{width: "100%", height: "100px", overflow: "hidden", borderRadius: "10px"}}
                                                        >
                                                            <img src={item} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                                                        </div>
                                                    ))
                                                }
                                            </MotionDiv>
                                        </div>
                                        <div>
                                            <ChevronDown size={24} strokeWidth={1} color={`${startIndex + 4 >= imageUrl.length ? "white" : "black"}`} style={{cursor: `${startIndex + 4 >= imageUrl.length ? "default" : "pointer"}`}} onClick={() => {moveUp()}} />
                                        </div>
                                    </Col>
                                    <Col span={16}>
                                        <AnimatePresence mode="wait">
                                            <MotionDiv key={imageSelect} {...divConfig} style={{width: "100%", height: "500px", overflow: "hidden"}}>
                                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={imageUrl[imageSelect]} />
                                            </MotionDiv>
                                        </AnimatePresence>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12} style={{paddingRight: "20px"}}>
                                <div style={{fontFamily: "Prata", fontSize: "25px", paddingBottom: "10px"}}>{productionInformation.name}</div>
                                <div style={{fontSize: "25px", fontWeight: "600"}}>{productionInformation.price}</div>
                                <div style={{display: "flex", gap: "20px", paddingTop: "30px", paddingBottom: "20px"}}>
                                    {
                                        productionInformation.color.map((item, index) => (
                                            <div key={index} style={{padding: "5px 10px", border: "1px solid var(--color7)", borderRadius: "15px"}}>{item}</div>
                                        ))
                                    }
                                </div>
                                <div style={{display: "flex", gap: "20px"}}>
                                    {
                                        productionInformation.size.map((item, index) => (
                                            <div key={index} style={{padding: "5px 10px", border: "1px solid var(--color7)", borderRadius: "15px"}}>{item}</div>
                                        ))
                                    }
                                </div>
                                <div style={{display: "flex", alignItems: "center", gap: "30px", paddingTop: "30px"}}>
                                    <div>Số lượng:</div>
                                    <div style={{padding: "2px", backgroundColor: "var(--color6)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <Minus size={20} strokeWidth={1} color="white" style={{cursor: "not-allowed"}} />
                                    </div>
                                    <div style={{fontSize: "20px"}}>1</div>
                                    <div style={{padding: "2px", backgroundColor: "var(--color6)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <Plus size={20} strokeWidth={1} color="white" style={{cursor: "not-allowed"}} />
                                    </div>
                                    <div>Còn hàng</div>
                                </div>
                                <div style={{display: "flex", gap: "20px", paddingTop: "30px"}}>
                                    <Button
                                        size="large"
                                        color="primary"
                                        variant="outlined"
                                        style={{width: "50%"}}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        size="large"
                                        color="primary"
                                        variant="solid"
                                        style={{width: "50%"}}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <div style={{position: "absolute", top: "20px", right: "20px", cursor: "pointer"}}>
                            <div style={{padding: "5px 7px", backgroundColor: "var(--color7)", borderRadius: "50%", width: "fit-content"}}>
                                <Heart size={20} strokeWidth={1} color="white" />
                            </div>
                        </div>
                    </Col>
                    <Col span={12} style={{paddingTop: "30px", paddingRight: "15px"}}>
                        <Row style={{backgroundColor: "white", padding: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                            <Col span={24} style={{paddingBottom: "20px"}}>
                                <div style={{fontSize: "25px", fontWeight: "600", paddingBottom: "10px"}}>Mô tả sản phẩm</div>
                                <div style={{textAlign: "justify"}}>{productionInformation.description}</div>
                            </Col>
                            <Col span={24}>
                                <div style={{fontSize: "25px", fontWeight: "600", paddingBottom: "10px"}}>Hướng dẫn bảo quản</div>
                                <div style={{whiteSpace: "pre-line", textAlign: "justify"}}>
                                    {productionInformation.preservation}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{paddingTop: "30px", paddingLeft: "15px"}}>
                        <Row style={{backgroundColor: "white", padding: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                            <Col span={24}>
                                <div style={{fontSize: "25px", fontWeight: "600", paddingBottom: "10px"}}>Đánh giá</div>
                            </Col>
                            <Col span={24} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <div style={{fontSize: "50px", fontWeight: "600"}}>4.3</div>
                                <RateValue rate={4.3} size={30} />
                                <div style={{fontSize: "20px"}}>3 đánh giá</div>
                            </Col>
                            <Col span={24} style={{paddingTop: "20px"}}>
                                <Row align={"middle"}>
                                    <Col span={7}>
                                        <div>Lọc đánh giá theo</div>
                                    </Col>
                                    <Col span={17} style={{paddingLeft: "20px"}}>
                                        <Row gutter={[20, 10]}>
                                            {
                                                optionFiler.map((item, index) => (
                                                    <Col span={8} key={index}>
                                                        <div className={`${index == 0 ? "option-active" : ""}`} style={{textAlign: "center", padding: "5px 10px", border: "1px solid var(--color7)", borderRadius: "20px"}}>{item}</div>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                {
                                    feedbackList.map((item, index) => (
                                        <div key={index} style={{padding: "20px 0px", borderTop: `${index == 0 ? "" : "1px solid rgba(0, 0, 0, 0.2)"}`}}>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px"}}>
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <div style={{paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.3)"}}>
                                                        <div>{item.name}</div>
                                                    </div>
                                                    <div style={{paddingLeft: "10px"}}>
                                                        <RateValue size={20} rate={item.rate} />
                                                    </div>
                                                </div>
                                                {
                                                    index == 0 && (
                                                        <div>
                                                            <PencilLine size={20} strokeWidth={1} />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div style={{textAlign: "justify"}}>{item.content}</div>
                                        </div>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    )
}

export default ProductionDetail;