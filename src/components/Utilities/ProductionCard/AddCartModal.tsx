import { useContext, useEffect, useState, type JSX } from "react";
import type { AddCartModalProps } from "../../../interfaces/customerInterface";
import { Button, Col, ConfigProvider, Modal, Row } from "antd";
import "./AddCartModal.scss";
import { ChevronDown, ChevronUp, Minus, Plus, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { configProvider, divConfig, messageService, MotionDiv, type ProductDetail, type RawProductDetail } from "../../../interfaces/appInterface";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../configs/globalVariable";
import dayjs from "dayjs";
import { addCart, getProductDetailModalApi, updateVariantInCartApi } from "../../../services/customerService";
import LoadingModal from "../../Other/LoadingModal";
import { RateValue } from "../../Other/ProductionDetail";

const AddCartModal = ({openAddCart, setopenAddCart, productId, variantId, quantity, cartId, cartList, setCartList, indexOfCart, setTotalPrice, setQuantityOrderList}: AddCartModalProps): JSX.Element => {
    const {user, setPathBeforeLogin, setCart} = useContext(UserContext);
    const navigate = useNavigate();

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
    const [dataDetail, setDataDetail] = useState<ProductDetail>(defaultDetail);
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
    const [imageSelect, setImageSelect] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [sizeSelect, setSizeSelect] = useState<string>("");
    const [colorSelect, setColorSelect] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantityState, setQuantityState] = useState<string>("");
    const [variantIdState, setVariantIdState] = useState<number>(0);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [discount, setDiscount] = useState<string>();
    const [quantitySelect, setQuantitySelect] = useState<number>(1);
    const [quantityNumber, setQuantityNumber] = useState<number | null>(null);
    const [showSelectQuantity, setShowSelectQuantity] = useState<boolean>(true);
    const [colorDisable, setColorDisable] = useState<string[]>([]);
    const [sizeDisable, setSizeDisable] = useState<string[]>([]);
    
    useEffect(() => {
        if (openAddCart) {
            getData();
        }
    }, [openAddCart])
    
    const processData = (rawData: RawProductDetail): ProductDetail => {
        const product = rawData.product;
        let rawVariant: {id: number, color: string, size: string, price: number, quantity: number, status: number}[] = [];
        let rawColor: string[] = [];
        let rawSize: string[] = []
        product.productVariants.forEach((item) => {
            rawVariant = [...rawVariant, {
                id: item.id,
                color: item.color,
                size: item.size,
                price: item.price,
                quantity: item.quantity,
                status: item.status
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
            rate: []
        }
        if (variantId) {
            const color = result.variant.find((item) => (item.id == variantId))?.color
            const size = result.variant.find((item) => (item.id == variantId))?.size
            setColorSelect(color ?? "")
            setSizeSelect(size ?? "")
            setQuantitySelect(quantity ?? -1)
        }
        return result
    }
    const getData = async () => {
        setSkeletonLoading(true);
        try {
            const result = await getProductDetailModalApi(user.accountId, productId);
            if (result.code == 0) {
                setDataDetail(processData(result.data));
            } else if (result.code == 2) {
                messageService.error(result.message);
                navigate("/")
            } else {
                messageService.error(result.message)
                setSkeletonLoading(false);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi tại server");
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
        disableSelectVariant();
        if (dataDetail && dataDetail.variant && dataDetail.variant.length > 0) {
            changePriceAndQuantity();
        }
    }, [colorSelect, sizeSelect, dataDetail])

    const changePriceAndQuantity = () => {
        if (colorSelect == "" || sizeSelect == "") {
            setQuantityState("Còn hàng");
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
                setQuantityState(`Còn ${variantSelect.quantity} sản phẩm`);
                setPrice(`${variantSelect.price.toLocaleString("en-US")}đ`);
                setVariantIdState(variantSelect.id);
                if (dataDetail.percent) {
                    const priceAfterDiscount = (Math.round(((variantSelect.price * (100 - dataDetail.percent)) / 100) / 1000) * 1000);
                    setDiscount(`${priceAfterDiscount.toLocaleString("en-US")}đ`)
                }
                if (variantSelect.quantity <= 0) {
                    setShowSelectQuantity(false);
                } else {
                    setShowSelectQuantity(true);
                }
                if (quantitySelect > variantSelect.quantity) {
                    setQuantitySelect(1)
                }
            } else {
                messageService.error("Không có dữ liệu");
            }
        }
        setSkeletonLoading(false);
    }

    useEffect(() => {
        const elements = document.querySelectorAll(".variant-disable");
        elements.forEach((element) => {
            const el = element as HTMLElement;
            const width = el.clientWidth;
            const height = el.clientHeight;
            const rotate = Math.atan(height / width) * (180 / Math.PI);
            const diagonal = Math.sqrt(width ** 2 + height ** 2);
            el.style.setProperty("--rotate", `${rotate}deg`);
            el.style.setProperty("--diagonal", `${diagonal}px`);
        });
    }, [colorDisable, sizeDisable]);

    const disableSelectVariant = () => {
        if (colorSelect == "" && sizeSelect != "") {
            const variant = dataDetail.variant.filter((item) => (item.size == sizeSelect));
            const colorArray = variant.map((item) => (item.color))
            const colorDisable = variant.filter((item) => (item.quantity == 0 || item.status == 2)).map((item) => (item.color))
            for (const item of dataDetail.color) {
                if (!colorArray.includes(item)) {
                    colorDisable.push(item)
                }
            }
            setColorDisable(colorDisable)
        }
        if (colorSelect != "" && sizeSelect == "") {
            const variant = dataDetail.variant.filter((item) => (item.color == colorSelect));
            const sizeArray = variant.map((item) => (item.size))
            const sizeDisable = variant.filter((item) => (item.quantity == 0 || item.status == 2)).map((item) => (item.size))
            for (const item of dataDetail.size) {
                if (!sizeArray.includes(item)) {
                    sizeDisable.push(item)
                }
            }
            setSizeDisable(sizeDisable)
        }
        if (colorSelect != "" && sizeSelect != "") {
            const variant1 = dataDetail.variant.filter((item) => (item.size == sizeSelect));
            const colorArray = variant1.map((item) => (item.color))
            const colorDisable = variant1.filter((item) => (item.quantity == 0 || item.status == 2)).map((item) => (item.color))
            for (const item of dataDetail.color) {
                if (!colorArray.includes(item)) {
                    colorDisable.push(item)
                }
            }
            setColorDisable(colorDisable)

            const variant2 = dataDetail.variant.filter((item) => (item.color == colorSelect));
            const sizeArray = variant2.map((item) => (item.size))
            const sizeDisable = variant2.filter((item) => (item.quantity == 0 || item.status == 2)).map((item) => (item.size))
            for (const item of dataDetail.size) {
                if (!sizeArray.includes(item)) {
                    sizeDisable.push(item)
                }
            }
            setSizeDisable(sizeDisable)
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
            if (quantitySelect <= 1) {
                messageService.error("Số lượng đặt hàng phải lớn hơn 0")
            } else {
                setQuantitySelect(prev => prev - 1)
            }
        } else {
            messageService.error("Chọn phân loại sản phẩm")
        }
    }

    const hasChange = (): boolean => {
        const variant = dataDetail.variant.find((item) => (item.id == variantId))
        if (colorSelect != variant?.color) {
            return true;
        }
        if (sizeSelect != variant?.size) {
            return true;
        }
        if (quantitySelect != quantity) {
            return true
        }
        return false;
    }
    const updateVariantInCart = async () => {
        if (cartId) {
            if (hasChange()) {
                setModalLoading(true);
                try {
                    const now = dayjs().toISOString();
                    const newVariantId = dataDetail.variant.find((item) => (item.color == colorSelect && item.size == sizeSelect))?.id
                    const result = await updateVariantInCartApi(cartId, user.accountId, newVariantId ?? -1, quantitySelect, now)
                    if (result.code == 0) {
                        messageService.success(result.message);
                        const found = cartList?.find((item) => (item.cartId == cartId));
                        if (found && setCartList && setTotalPrice && setQuantityOrderList) {
                            const data = result.data[0];
                            const percent = data.productVariant?.product?.productPromotions.find((item: any) => (item != null))?.promotion?.percent;
                            let cartUpdate = {
                                ...found, 
                                quantityOrder: quantitySelect, 
                                color: colorSelect, 
                                size: sizeSelect, 
                                quantity: data.productVariant.quantity,
                                price: data.productVariant.price,
                                discount: percent ? (Math.round((data.productVariant.price * ((100 - percent) / 100)) / 1000) * 1000) : null
                            };
                            setTotalPrice((prev) => (
                                prev.map((item, index) => (index == indexOfCart ? (cartUpdate.discount ? cartUpdate.discount * cartUpdate.quantityOrder : cartUpdate.price * cartUpdate.quantityOrder) : item))
                            ))
                            setQuantityOrderList((prev) => (
                                prev.map((item, index) => (index == indexOfCart ? cartUpdate.quantityOrder : item))
                            ))
                            setCartList((prev) => (
                                prev.map((item) => (item.cartId == cartId ? cartUpdate : item))
                            ))
                        }
                        setopenAddCart(false);
                    } else {
                        messageService.error(result.message)
                    }
                } catch(e) {
                    console.log(e);
                    messageService.error("Xảy ra lỗi ở server");
                } finally {
                    setModalLoading(false);
                }
            } else {
                messageService.success("Thay đổi thành công");
                setopenAddCart(false);
            }
        }
    }

    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
                <Modal
                    className="add-cart-modal"
                    title={null}
                    closable={false}
                    open={openAddCart}
                    footer={null}
                    centered={true}
                    maskClosable={false}
                    width={"1000px"}
                    loading={skeletonLoading}
                >
                    <Row>
                        <Col span={24} style={{position: "relative"}}>
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
                                        <Col span={16} style={{paddingLeft: "20px"}}>
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
                                    <div style={{display: "flex", alignItems: "center", paddingBottom: "10px"}}>
                                        <div style={{paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.4)"}}>
                                            <RateValue rate={dataDetail.averageStar} size={30} />
                                        </div>
                                        <div style={{paddingLeft: "10px", fontSize: "18px"}}>{`${dataDetail.totalRate == 0 ? "Chưa có đánh giá" : `${dataDetail.totalRate} đánh giá`}`}</div>
                                    </div>
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
                                                    className={`item-variant ${colorSelect == item ? "variant-active" : ""} ${colorDisable.includes(item) ? "variant-disable" : ""}`} 
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
                                                    className={`item-variant ${sizeSelect == item ? "variant-active" : ""} ${sizeDisable.includes(item) ? "variant-disable" : ""}`} 
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
                                                    <div>{quantityState}</div>
                                                </div>
                                                <div style={{display: "flex", gap: "20px", paddingTop: "30px"}}>
                                                    <Button
                                                        size="large"
                                                        color="primary"
                                                        variant="solid"
                                                        style={{width: "100%"}}
                                                        onClick={() => {
                                                            if (variantId == null) {
                                                                addCart(user, sizeSelect, colorSelect, variantIdState, quantitySelect, setCart, setPathBeforeLogin, navigate, setModalLoading, dayjs().toISOString())
                                                            } else {
                                                                updateVariantInCart();
                                                            }
                                                        }}
                                                    >
                                                        {`${variantId != null ? "Lưu thay đổi" : "Thêm vào giỏ hàng"}`}
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
                            <div 
                                style={{position: "absolute", top: "10px", right: "10px", cursor: "pointer"}}
                                onClick={() => {setopenAddCart(false)}}
                            >
                                <X size={30} strokeWidth={1} />
                            </div>
                        </Col>
                    </Row>
                </Modal>
                {
                    <LoadingModal 
                        open={modalLoading}
                        message="Đang lưu"
                    />
                }
            </ConfigProvider>
        </>
    )
}

export default AddCartModal;