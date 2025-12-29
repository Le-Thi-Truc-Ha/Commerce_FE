import { Button, Col, ConfigProvider, Pagination, Row, Skeleton } from "antd";
import { ChevronDown, ChevronUp, Heart, HeartOff, Minus, PencilLine, Plus, Star } from "lucide-react";
import { useContext, useEffect, useRef, useState, type JSX } from "react";
import "./ProductionDetail.scss";
import { AnimatePresence } from "framer-motion";
import { configProvider, divConfig, messageService, MotionDiv, type ProductDetail, type RateData, type RawProductDetail } from "../../interfaces/appInterface";
import { UserContext } from "../../configs/globalVariable";
import { getProductDetailApi, getRateApi, saveHistoryApi } from "../../services/appService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import LoadingModal from "./LoadingModal";
import { addCart, addFavourite, deleteFavourite } from "../../services/customerService";
import { getSessionKey } from "../../configs/axios";
import { setSessionKey } from "./Login";
import type { CartProduct } from "../../interfaces/customerInterface";
import { PhotoProvider, PhotoView } from "react-photo-view";

export const RateValue = ({rate, size}: {rate: number, size: number}): JSX.Element => {
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
    const {user, setPathBeforeLogin, setCart} = useContext(UserContext);
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const optionFilter: string[] = ["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"]
    const filterOrder: number[] = [0, 5, 4, 3, 2, 1];
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
        averageStar: 0
    }
    const sizeOrder = ["xs", "s", "m", "l", "xl", "xxl"];
    const preservation = `- Giặt tay để tránh bay màu hoặc xù lông, ủi nhiệt độ bình thường.
                       - Không vắt hoặc xoắn mạnh vì điều này có thể gây ra các nếp nhăn và ảnh hưởng đến độ bền, cấu trúc của vải.
                       - Phơi, ủi mặt trái sản phẩm.`

    const firstRender = useRef<boolean>(true);
    const [dataDetail, setDataDetail] = useState<ProductDetail>(defaultDetail);
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
    const [rateList, setRateList] = useState<RateData[]>([]);
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
    const [colorDisable, setColorDisable] = useState<string[]>([]);
    const [sizeDisable, setSizeDisable] = useState<string[]>([]);
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [filterSelect, setFilterSelect] = useState<number>(0);
    const [getRateLoading, setGetRateLoading] = useState<boolean>(false);
    const [totalRateRecord, setTotalRateRecord] = useState<number>(0);
    
    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenEl =
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement;
            setIsExpand(!!fullscreenEl);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, []);
    
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        getData();
        saveHistory();
    }, [])
    
    const saveHistory = async () => {
        if (!isNaN(Number(id))) {
            setSkeletonLoading(true)
            try {
                const result = await saveHistoryApi(user.isAuthenticated ? user.accountId : -1, Number(id), dayjs().toISOString());
                if (result.code != 0) {
                    messageService.error("Xảy ra lỗi trong quá trình lưu lịch sử xem sản phẩm");
                } else {
                    if (!user.isAuthenticated) {
                        const keyBeforeLogin = getSessionKey();
                        if (!keyBeforeLogin) {
                            setSessionKey(result.data, 30);
                        }
                    }
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            }
        }
    }
    
    const processData = (rawData: RawProductDetail): {productInformation: ProductDetail, rateList: RateData[]} => {
        const product = rawData.product;
        const rate = rawData.rate.filter((item) => (item != null));
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
        const productInformation: ProductDetail = {
            id: product.id,
            name: product.name,
            percent: product.productPromotions.find((promotionItem) => (promotionItem.promotion != null))?.promotion?.percent ?? null,
            variant: rawVariant,
            color: [...new Set(rawColor)],
            size: [...new Set(rawSize)].sort((a, b) => (sizeOrder.indexOf(a.toLowerCase()) - sizeOrder.indexOf(b.toLowerCase()))), 
            isLike: product.favourites.length > 0 ? true : false,
            image: [
                ...product.medias.filter((item) => (item.url.includes("/video/upload"))).map((item) => (item.url)), 
                ...product.medias.filter((item) => (item.url.includes("/image/upload"))).map((item) => (item.url))
            ],
            description: product.description,
            totalRate: rawData.count,
            averageStar: product.rateStar ?? 0
        }
        const rateList: RateData[] = rate.map((item) => (
            {
                id: item.id,
                createAt: dayjs(item.feeedbackDate),
                accountId: item.account?.id ?? -1,
                name: item.account?.email ?? "",
                star: item.star,
                content: item.content,
                url: item.medias.map((i) => ({url: i.url, type: i.type})).sort((a, b) => (b.type - a.type)),
                size: item.productVariant?.size ?? "",
                color: item.productVariant?.color ?? ""
            }
        ))
        setTotalRateRecord(rawData.count);
        setIsLikeState(product.favourites.length > 0 ? true : false)
        return {productInformation, rateList}
    }
    const getData = async () => {
        if (!isNaN(Number(id))) {
            setSkeletonLoading(true);
            try {
                const result = await getProductDetailApi(user.isAuthenticated ? user.accountId : -1, Number(id), pageRate);
                if (result.code == 0) {
                    const process = processData(result.data);
                    setDataDetail(process.productInformation);
                    setRateList(process.rateList);
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
        disableSelectVariant();
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

    const orderProduct = async () => {
        if (user.isAuthenticated) {
            if (sizeSelect == "" || colorSelect == "") {
                messageService.error("Chọn phân loại sản phẩm")
            } else {
                const parentCategory = location.pathname.split("/")[2];
                const price = dataDetail.variant.find((item) => (item.id == variantId))?.price ?? 0
                const productOrder: CartProduct[] = [{
                    productId: dataDetail.id,
                    productVariantId: variantId,
                    cartId: 0,
                    parentCategory: parentCategory,
                    url: dataDetail.image[0],
                    name: dataDetail.name,
                    price: price,
                    discount: dataDetail.percent ? Math.round((price * ((100 - dataDetail.percent) / 100)) / 1000) * 1000 : null,
                    color: colorSelect,
                    size: sizeSelect,
                    quantityOrder: quantitySelect,
                    quantity: quantityNumber ?? 0,
                    statusCart: -1,
                    statusProduct: 1
                }]
                localStorage.setItem("productOrder", JSON.stringify(productOrder))
                navigate("/customer/pay")
            }
        } else {
            setPathBeforeLogin(location.pathname);
            navigate("/login")
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        getRate()
    }, [filterSelect, pageRate])

    const getRate = async () => {
        setGetRateLoading(true);
        try {
            const result = await getRateApi(dataDetail.id, filterOrder[filterSelect], pageRate);
            if (result.code == 0) {
                const rateList: RateData[] = result.data.rate.map((item: any) => (
                    {
                        id: item.id,
                        createAt: dayjs(item.feeedbackDate),
                        accountId: item.account?.id ?? -1,
                        name: item.account?.email ?? "",
                        star: item.star,
                        content: item.content,
                        url: item.medias.map((i: any) => ({url: i.url, type: i.type})).sort((a: any, b: any) => (b.type - a.type)),
                        size: item.productVariant?.size ?? "",
                        color: item.productVariant?.color ?? ""
                    }
                ))
                setRateList(rateList);
                if (pageRate == 1) {
                    setTotalRateRecord(result.data.count);
                }
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetRateLoading(false);
        }
    }

    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
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
                                                        style={{position: "relative", height: "460px", maxWidth: "80px", overflow: "hidden"}}
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
                                                                        {
                                                                            item.includes("/image/upload") ? (
                                                                                <img loading="eager" src={item} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                                                                            ) : (
                                                                                <video style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px"}} controls={false} autoPlay={false} muted preload="metadata">
                                                                                    <source src={item} />
                                                                                </video>
                                                                            )
                                                                        }
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
                                                            {
                                                                dataDetail.image?.[imageSelect]?.includes("/image/upload") ? (
                                                                    <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={dataDetail.image[imageSelect]} />
                                                                ) : (
                                                                    <video style={{width: "100%", height: "100%", objectFit: "contain"}} controls={true}>
                                                                        <source src={dataDetail.image[imageSelect]} />
                                                                    </video>
                                                                )
                                                            }
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
                                                            <div>{quantity}</div>
                                                        </div>
                                                        <div style={{display: "flex", gap: "20px", paddingTop: "30px"}}>
                                                            <Button
                                                                size="large"
                                                                color="primary"
                                                                variant="outlined"
                                                                style={{width: "50%"}}
                                                                onClick={() => {addCart(user, [sizeSelect], [colorSelect], [variantId], [quantitySelect], [dataDetail.id], setCart, setPathBeforeLogin, navigate, setModalLoading, dayjs().toISOString(), false)}}
                                                            >
                                                                Thêm vào giỏ hàng
                                                            </Button>
                                                            <Button
                                                                size="large"
                                                                color="primary"
                                                                variant="solid"
                                                                style={{width: "50%"}}
                                                                onClick={() => {orderProduct()}}
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
                                            <div style={{fontSize: "50px", fontWeight: "600"}}>{dataDetail.averageStar}</div>
                                            <RateValue rate={dataDetail.averageStar} size={30} />
                                            <div style={{fontSize: "20px"}}>{`${dataDetail.totalRate} đánh giá`}</div>
                                        </Col>
                                        <Col span={24} style={{paddingTop: "20px"}}>
                                            <Row align={"middle"}>
                                                <Col span={7}>
                                                    <div>Lọc đánh giá theo</div>
                                                </Col>
                                                <Col span={17} style={{paddingLeft: "20px"}}>
                                                    <Row gutter={[20, 10]}>
                                                        {
                                                            optionFilter.map((item, index) => (
                                                                <Col 
                                                                    span={8} 
                                                                    key={index} 
                                                                    onClick={() => {
                                                                        setFilterSelect(index); 
                                                                        setPageRate(1)
                                                                    }}
                                                                >
                                                                    <div className={`item-option ${index == filterSelect ? "option-active" : ""}`} style={{textAlign: "center", padding: "5px 10px", border: "1px solid var(--color7)", borderRadius: "20px"}}>{item}</div>
                                                                </Col>
                                                            ))
                                                        }
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        {
                                            totalRateRecord > 0 ? (
                                                <>
                                                    
                                                    <Col span={24}>
                                                        {
                                                            rateList.map((item, index) => (
                                                                <div key={index} style={{padding: "20px 0px", borderTop: `${index == 0 ? "" : "1px solid rgba(0, 0, 0, 0.2)"}`}}>
                                                                    <div style={{display: "flex", flexDirection: "column", paddingBottom: "10px"}}>
                                                                        <div style={{display: "flex", alignItems: "center", paddingBottom: "5px"}}>
                                                                            <div style={{paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.3)"}}>
                                                                                <div>{`${item.name.slice(0, 2)}${Array(10).fill("*").join("")}${item.name.slice(item.name.length - 2, item.name.length)}`}</div>
                                                                            </div>
                                                                            <div style={{paddingLeft: "10px"}}>
                                                                                <RateValue size={20} rate={item.star} />
                                                                            </div>
                                                                        </div>
                                                                        <div style={{display: "flex", alignItems: "center"}}>
                                                                            <div style={{fontSize: "14px", color: "#949494ff", paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.3)"}}>
                                                                                {item.createAt.format("DD/MM/YYYY HH:mm")}
                                                                            </div>
                                                                            <div style={{fontSize: "14px", color: "#949494ff", paddingLeft: "10px"}}>
                                                                                {item.color}/{item.size}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <PhotoProvider>
                                                                        <Row style={{display: "flex", gap: "20px", paddingBottom: `${item.url.length > 0 ? "10px" : "0px"}`}}>
                                                                            {
                                                                                item.url.map((i, idx) => (
                                                                                    <Col span={4} key={idx} style={{width: "20%", height: "80px", overflow: "hidden"}}>
                                                                                        {
                                                                                            i.type == 1 ? (
                                                                                                <PhotoView src={i.url}>
                                                                                                    <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={i.url} />
                                                                                                </PhotoView>
                                                                                            ) : (
                                                                                                <video style={{width: "100%", height: "100%", objectFit: `${isExpand ? "contain" : "cover"}`}} controls={true}>
                                                                                                    <source src={i.url} />
                                                                                                </video>
                                                                                            )
                                                                                        }
                                                                                    </Col>
                                                                                ))
                                                                            }
                                                                        </Row>
                                                                    </PhotoProvider>
                                                                    <div style={{textAlign: "justify"}}>{item.content}</div>
                                                                </div>
                                                            ))
                                                        }
                                                    </Col>
                                                    <Col span={24}>
                                                        <Pagination
                                                            current={pageRate}
                                                            pageSize={3}
                                                            total={totalRateRecord}
                                                            align="center"
                                                            showSizeChanger={false}
                                                            onChange={(page) => {
                                                                setPageRate(page);
                                                            }}
                                                        />
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24} style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.7, paddingTop: "10px"}}>
                                                        <div style={{width: "90%", height: "300px", overflow: "hidden"}}>
                                                            <img style={{width: "100%", height: "100%", objectFit: "contain"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1762242307/marketing_kcan6u.png" />
                                                        </div>
                                                        <div style={{fontSize: "20px"}}>{`Chưa có đánh giá ${filterSelect == 0 ? "" : `${filterOrder[filterSelect]} sao`}`}</div>
                                                    </Col>
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </Row>
                    </Col>
                </Row>
            </ConfigProvider>
            <LoadingModal 
                open={modalLoading || getRateLoading}
                message={`${getRateLoading ? "Đang lấy dữ liệu" : "Đang lưu"}`}
            />
        </>
    )
}

export default ProductionDetail;