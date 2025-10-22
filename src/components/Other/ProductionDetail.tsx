import { Button, Col, ConfigProvider, Row, Skeleton } from "antd";
import { ChevronDown, ChevronUp, Heart, HeartOff, Minus, PencilLine, Plus, Star } from "lucide-react";
import { useContext, useEffect, useState, type JSX } from "react";
import "./ProductionDetail.scss";
import { AnimatePresence, percent } from "framer-motion";
import { divConfig, messageService, MotionDiv, type ProductDetail, type RawProductDetail } from "../../interfaces/appInterface";
import { UserContext } from "../../configs/globalVariable";
import { getProductDetailApi } from "../../services/appService";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import LoadingModal from "./LoadingModal";
import { addFavourite, deleteFavourite } from "../../services/customerService";

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
    const {user, setPathBeforeLogin} = useContext(UserContext);
    const {id} = useParams();
    const navigate = useNavigate();

    const optionFiler: string[] = ["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"]
    const defaultDetail: ProductDetail = {
        id: -1,
        name: "",
        percent: null,
        variant: [],
        size: [],
        color: [],
        isLike: false,
        image: [],
        description: "",
        totalRate: 0,
        averageStar: 0,
        rate: []
    }
    const sizeOrder = ["xs", "s", "m", "l", "xl", "xxl"];
    const preservation = `- Giặt tay để tránh bay màu hoặc xù lông, ủi nhiệt độ bình thường.
                       - Không vắt hoặc xoắn mạnh vì điều này có thể gây ra các nếp nhăn và ảnh hưởng đến độ bền, cấu trúc của vải.
                       - Phơi, ủi mặt trái sản phẩm.`
    const [dataDetail, setDataDetail] = useState<ProductDetail>(defaultDetail);
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
    const [pageRate, setPageRate] = useState<number>(1);
    const [imageSelect, setImageSelect] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [sizeSelect, setSizeSelect] = useState<string>("");
    const [colorSelect, setColorSelect] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [variantId, setVariantId] = useState<number>(0);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [isLikeState, setIsLikeState] = useState<boolean>(false);
    const [discount, setDiscount] = useState<string>();
    const [quantitySelect, setQuantitySelect] = useState<number>(1);
    const [quantityNumber, setQuantityNumber] = useState<number | null>(null);
    const [showSelectQuantity, setShowSelectQuantity] = useState<boolean>(true);

    const saveHistory = async () => {
        try {

        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        }
    }
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        getData();
    }, [])
    const processData = (rawData: RawProductDetail): ProductDetail => {
        const product = rawData.product;
        const rate = rawData.rate.filter((item) => (item != null));
        let rawVariant: {id: number, color: string, size: string, price: number, quantity: number}[] = [];
        let rawColor: string[] = [];
        let rawSize: string[] = []
        product.productVariants.forEach((item) => {
            rawVariant = [...rawVariant, {
                id: item.id,
                color: item.color,
                size: item.size,
                price: item.price,
                quantity: item.quantity
            }],
            rawColor = [...rawColor, item.color];
            rawSize = [...rawSize, item.size];
        })
        const result: ProductDetail = {
            id: product.id,
            name: product.name,
            percent: product.productPromotions.find((promotionItem) => (promotionItem.promotion != null))?.promotion?.percent ?? null,
            variant: rawVariant,
            color: [...new Set(rawColor)],
            size: [...new Set(rawSize)].sort((a, b) => (sizeOrder.indexOf(a.toLowerCase()) - sizeOrder.indexOf(b.toLowerCase()))), 
            isLike: product.favourites.length > 0 ? true : false,
            image: product.medias.map((item) => (item.url)),
            description: product.description,
            totalRate: rawData.count,
            averageStar: product.rateStar ?? 0,
            rate: rate.map((item) => (
                {
                    id: item.id,
                    createAt: dayjs(item.feeedbackDate),
                    accountId: item.account?.id ?? -1,
                    name: item.account?.email ?? "",
                    star: item.star,
                    content: item.content,
                    url: item.medias.map((item) => (item.url)),
                    size: item.productVariant?.size ?? "",
                    color: item.productVariant?.color ?? ""
                }
            ))
        }
        setIsLikeState(product.favourites.length > 0 ? true : false)
        return result
    }
    const getData = async () => {
        if (id && !isNaN(Number(id))) {
            setSkeletonLoading(true);
            try {
                const result = await getProductDetailApi(user.isAuthenticated ? user.accountId : -1, Number(id), pageRate);
                console.log(result.data);
                setSkeletonLoading(false);
                if (result.code == 0) {
                    setDataDetail(processData(result.data));
                } else {
                    messageService.error(result.message)
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi tại server");
            } finally {
                setSkeletonLoading(false);
            }
        } else {
            setSkeletonLoading(true);
            messageService.error("Không tìm thấy dữ liệu");
        }
    }

    const moveUp = () => {
        const newValue = startIndex + 1;
        if (newValue + 4 > dataDetail?.image.length) {
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

    useEffect(() => {
        if (dataDetail && dataDetail.variant && dataDetail.variant.length > 0) {
            changePriceAndQuantity();
        }
    }, [colorSelect, sizeSelect, dataDetail])
    const changePriceAndQuantity = () => {
        if (colorSelect == "" || sizeSelect == "") {
            setQuantity("Còn hàng");
            const minPrice = dataDetail.variant.sort((a, b) => (a.price - b.price))[0].price;
            const maxPrice = dataDetail.variant.sort((a, b) => (b.price - a.price))[0].price;
            if (dataDetail.percent) {
                const minDiscount = Math.round(((minPrice * (100 - dataDetail.percent)) / 100) / 1000) * 1000;
                const maxDiscount = Math.round(((maxPrice * (100 - dataDetail.percent)) / 100) / 1000) * 1000;
                setDiscount(minDiscount == maxDiscount ? `${minDiscount.toLocaleString("en-US")}đ` : `${minDiscount.toLocaleString("en-US")}đ - ${maxDiscount.toLocaleString("en-US")}đ`)
            }
            setPrice(minPrice == maxPrice ? `${minPrice.toLocaleString("en-US")}đ` : `${minPrice.toLocaleString("en-US")}đ - ${maxPrice.toLocaleString("en-US")}đ`)
        } else {
            const variantSelect = dataDetail.variant.find((item) => (item.color == colorSelect && item.size == sizeSelect));
            if (variantSelect) {
                setQuantityNumber(variantSelect.quantity);
                setQuantity(`Còn ${variantSelect.quantity} sản phẩm`);
                setPrice(`${variantSelect.price.toLocaleString("en-US")}đ`);
                setVariantId(variantSelect.id);
                if (dataDetail.percent) {
                    setDiscount(`${(Math.round(((variantSelect.price * (100 - dataDetail.percent)) / 100) / 1000) * 1000).toLocaleString("en-US")}đ`)
                }
                if (variantSelect.quantity <= 0) {
                    setShowSelectQuantity(false);
                } else {
                    setShowSelectQuantity(true);
                }
            } else {
                messageService.error("Không có dữ liệu");
            }
        }
    }

    const increaseQuantity = () => {
        if (colorSelect != "" && sizeSelect != "") {
            if (quantityNumber) {
                if (quantitySelect >= quantityNumber) {
                    messageService.error("Không đủ số lượng giao hàng")
                } else {
                    setQuantitySelect(prev => prev + 1)
                }
            }
        } else {
            messageService.error("Chọn phân loại sản phẩm")
        }
    }

    const decreaseQuantity = () => {
        if (colorSelect != "" && sizeSelect != "") {
            if (quantitySelect < 1) {
                messageService.error("Số lượng đặt hàng phải lớn hơn 0")
            } else {
                setQuantitySelect(prev => prev - 1)
            }
        } else {
            messageService.error("Chọn phân loại sản phẩm")
        }
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
                        {
                            skeletonLoading ? (
                                <Skeleton active paragraph={{rows: 10}} />
                            ) : (
                                <>
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
                                                                dataDetail?.image.map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`image-item ${imageSelect === index ? "image-active" : ""}`}
                                                                        onClick={() => setImageSelect(index)}
                                                                        style={{width: "100%", height: "100px", overflow: "hidden", borderRadius: "10px"}}
                                                                    >
                                                                        <img loading="eager" src={item} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                                                                    </div>
                                                                ))
                                                            }
                                                        </MotionDiv>
                                                    </div>
                                                    <div>
                                                        <ChevronDown size={24} strokeWidth={1} color={`${startIndex + 4 >= dataDetail.image.length ? "white" : "black"}`} style={{cursor: `${startIndex + 4 >= dataDetail.image.length ? "default" : "pointer"}`}} onClick={() => {moveUp()}} />
                                                    </div>
                                                </Col>
                                                <Col span={16}>
                                                    <AnimatePresence mode="wait">
                                                        <MotionDiv key={imageSelect} {...divConfig} style={{width: "100%", height: "500px", overflow: "hidden"}}>
                                                            <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={dataDetail.image[imageSelect]} />
                                                        </MotionDiv>
                                                    </AnimatePresence>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12} style={{paddingRight: "20px"}}>
                                            <div style={{fontFamily: "Prata", fontSize: "25px", paddingBottom: "10px"}}>{dataDetail.name}</div>
                                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                                {
                                                    dataDetail.percent && (
                                                        <div className="text-danger" style={{fontSize: "25px", fontWeight: "600"}}>{discount}</div>
                                                    )
                                                }
                                                <div style={
                                                    dataDetail.percent ? {
                                                        fontSize: "18px", textDecoration: "line-through"
                                                    } : {
                                                        fontSize: "25px", fontWeight: "600"
                                                    }
                                                }>
                                                    {price}
                                                </div>
                                            </div>
                                            <div style={{display: "flex", gap: "20px", paddingTop: "30px", paddingBottom: "20px"}}>
                                                {
                                                    dataDetail.color.map((item, index) => (
                                                        <div 
                                                            className={`item-variant ${colorSelect == item ? "variant-active" : ""}`} 
                                                            onClick={() => {setColorSelect(item)}} 
                                                            key={index}
                                                        >
                                                            {item}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div style={{display: "flex", gap: "20px"}}>
                                                {
                                                    dataDetail.size.map((item, index) => (
                                                        <div 
                                                            className={`item-variant ${sizeSelect == item ? "variant-active" : ""}`} 
                                                            onClick={() => {setSizeSelect(item)}} 
                                                            key={index} 
                                                        >
                                                            {item}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            {
                                                showSelectQuantity ? (
                                                    <>
                                                        <div style={{display: "flex", alignItems: "center", gap: "30px", paddingTop: "30px"}}>
                                                            <div>Số lượng:</div>
                                                            <div style={{padding: "2px", backgroundColor: "var(--color6)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                                <Minus size={20} strokeWidth={1} color="white" style={{cursor: "pointer"}} onClick={() => {decreaseQuantity()}} />
                                                            </div>
                                                            <div style={{fontSize: "20px"}}>{quantitySelect}</div>
                                                            <div style={{padding: "2px", backgroundColor: "var(--color6)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                                <Plus size={20} strokeWidth={1} color="white" style={{cursor: "pointer"}} onClick={() => {increaseQuantity()}} />
                                                            </div>
                                                            <div>{quantity}</div>
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
                                                    </>
                                                ) : (
                                                    <div style={{display: "flex", paddingTop: "30px"}}>
                                                        <div style={{fontSize: "20px"}}>Phân loại này đã hết hàng</div>
                                                    </div>
                                                )
                                            }
                                            
                                        </Col>
                                    </Row>
                                    <div style={{position: "absolute", top: "20px", right: "20px", cursor: "pointer"}}>
                                        <div style={{padding: "5px 7px", backgroundColor: "var(--color7)", borderRadius: "50%", width: "fit-content"}}>
                                            {
                                                isLikeState ? (
                                                    <HeartOff size={20} strokeWidth={1} color="white" onClick={() => {deleteFavourite(user, setModalLoading, dataDetail.id, setIsLikeState, navigate, setPathBeforeLogin)}} />
                                                ) : (
                                                    <Heart size={20} strokeWidth={1} color="white" onClick={() => {addFavourite(user, setModalLoading, dataDetail.id, setIsLikeState, navigate, setPathBeforeLogin)}} />
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                        }
                        
                        
                    </Col>
                    <Col span={12} style={{paddingTop: "30px", paddingRight: "15px"}}>
                        <Row style={{backgroundColor: "white", padding: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                            {
                                skeletonLoading ? (
                                    <Skeleton active paragraph={{rows: 10}}/>
                                ) : (
                                    <>
                                        <Col span={24} style={{paddingBottom: "20px"}}>
                                            <div style={{fontSize: "25px", fontWeight: "600", paddingBottom: "10px"}}>Mô tả sản phẩm</div>
                                            <div style={{textAlign: "justify"}}>{dataDetail.description}</div>
                                        </Col>
                                        <Col span={24}>
                                            <div style={{fontSize: "25px", fontWeight: "600", paddingBottom: "10px"}}>Hướng dẫn bảo quản</div>
                                            <div style={{whiteSpace: "pre-line", textAlign: "justify"}}>
                                                {preservation}
                                            </div>
                                        </Col>
                                    </>
                                )
                            }
                        </Row>
                    </Col>
                    <Col span={12} style={{paddingTop: "30px", paddingLeft: "15px"}}>
                        <Row style={{backgroundColor: "white", padding: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                            {
                                skeletonLoading ? (
                                    <Skeleton active paragraph={{rows: 10}}/>
                                ) : (
                                    <>
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
                                                                    <div className={`item-option ${index == 0 ? "option-active" : ""}`} style={{textAlign: "center", padding: "5px 10px", border: "1px solid var(--color7)", borderRadius: "20px"}}>{item}</div>
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
                                    </>
                                )
                            }
                            
                            
                        </Row>
                    </Col>
                </Row>
            </ConfigProvider>
            {
                modalLoading && (
                    <LoadingModal 
                        open={modalLoading}
                        message="Đang lưu"
                    />
                )
            }
        </>
    )
}

export default ProductionDetail;