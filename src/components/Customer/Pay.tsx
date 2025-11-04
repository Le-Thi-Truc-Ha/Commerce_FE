import { Button, Col, ConfigProvider, Input, Radio, Row, Skeleton } from "antd";
import { useContext, useEffect, useLayoutEffect, useRef, useState, type JSX } from "react";
import "./Pay.scss";
import { ChevronRight, TicketPercent, X } from "lucide-react";
import { configProvider, messageService, MotionDiv } from "../../interfaces/appInterface";
import { type AddressInformation, type CartProduct, type ProductVoucher, type ShipVoucher } from "../../interfaces/customerInterface";
import { UserContext } from "../../configs/globalVariable";
import { getAddressAndFeeApi, getCity, getCoordinates, getDistrict, getVoucherApi, getWard, orderProductApi } from "../../services/customerService";
import { AnimatePresence } from "framer-motion";
import AddressListModal from "../Utilities/Other/AddressListModal";
import dayjs from "dayjs";
import VoucherModal from "../Utilities/Order/VoucherModal";
import lodash from "lodash";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../Other/LoadingModal";

const {TextArea} = Input;

const Pay = (): JSX.Element => {
    const shopLongitude = 106.77823;
    const shopLatitude = 10.846309;

    const {user, setCart} = useContext(UserContext);
    const navigate = useNavigate();

    const refItem = useRef<(HTMLDivElement | null)[]>([]);
    const parentElement = useRef<(HTMLDivElement | null)>(null);
    const [indexOfItem, setIndexOfItem] = useState<number>(0);
    const [position, setPosition] = useState<{xLeft: number | null, width: number | null}>({xLeft: null, width: null})
    
    const [productOrder, setProductOrder] = useState<CartProduct[]>([])
    const [addressFirst, setAddressFirst] = useState<AddressInformation | null>(null)
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [detailAddress, setDetailAddress] = useState<string>("");
    const [regionAddress, setRegionAddress] = useState<string>("");
    const [showSelectAddress, setShowSelectAddress] = useState<boolean>(false);
    const [getAddressLoading, setGetAddressLoading] = useState<boolean>(false);
    const [regionObj, setRegionObj] = useState<{cityCode: number | null, districtCode: number | null, wardCode: number | null}>({cityCode: null, districtCode: null, wardCode: null})
    const [regionArray, setRegionArray] = useState<string[]>(["", "", ""])
    const [cityList, setCityList] = useState<any[]>([]);
    const [districtList, setDistrictList] = useState<any[]>([]);
    const [wardList, setWardList] = useState<any[]>([]); 
    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);
    const [shippingFeeList, setShippingFeeList] = useState<{id: number, maxDistance: number, minDistance: number, cost: number}[]>([]);
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [shippingFeeId, setShippingFeeId] = useState<number>(-1);
    const [openAddressList, setOpenAddressList] = useState<boolean>(false);
    const [payMethod, setPayMethod] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [note, setNote] = useState<string>("");
    const [shipVoucherList, setShipVoucherList] = useState<ShipVoucher[]>([]);
    const [productVoucherList, setProductVoucherList] = useState<ProductVoucher[]>([]);
    const [productVoucherSelect, setProductVoucherSelect] = useState<number>(-1);
    const [shipVoucherSelect, setShipVoucherSelect] = useState<number>(-1);
    const [openVoucher, setOpenVoucher] = useState<boolean>(false);
    const [shipDiscount, setShipDiscount] = useState<number>(0);
    const [productDiscount, setProductDiscount] = useState<number>(0);
    const [totalPriceProductType3, setTotalPriceProductType3] = useState<number>(0);
    const [voucherCode, setVoucherCode] = useState<string>("");
    const [hasValidate, setHasValidate] = useState<boolean[]>([false, false, false, false])
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [orderProductLoading, setOrderProductLoading] = useState<boolean>(false);

    const unitAddress: string[] = ["Thành phố", "Quận", "Phường"]
    
    useEffect(() => {
        const item = localStorage.getItem("productOrder");
        if (item) {
            const rawProductOrder = JSON.parse(item);
            const rawTotalPrice = rawProductOrder.reduce((sum: any, current: any) => (current.discount ? sum + current.discount * current.quantityOrder : sum + current.price * current.quantityOrder), 0);
            setProductOrder(rawProductOrder)
            setTotalPrice(rawTotalPrice)
            getVoucher(rawProductOrder, rawTotalPrice);
        }
        getAddressAndFee();
    }, [])

    const getAddressAndFee = async () => {
        setGetAddressLoading(true);
        try {
            const result = await getAddressAndFeeApi(user.accountId);
            if (result.code == 0) {
                const rawAddress = result.data.address;
                if (rawAddress) {
                    setAddressFirst({
                        id: rawAddress.id,
                        name: rawAddress.name,
                        phone: rawAddress.phoneNumber,
                        address: rawAddress.address,
                        longitude: rawAddress.longitude,
                        latitude: rawAddress.latitude
                    })
                    setName(rawAddress.name);
                    setPhone(rawAddress.phoneNumber);

                    const addressArray = rawAddress.address.split("=");
                    setDetailAddress(addressArray[0])
                    setRegionAddress(addressArray[1])
                    setLongitude(rawAddress.longitude)
                    setLatitude(rawAddress.latitude)

                    const regionArray = addressArray[1].split(", ")
                    setRegionArray(regionArray);
                    const cityList: any[] = await getCity(setCityList);
                    console.log(cityList);
                    const cityCode = cityList.find((item) => (`${item.type} ${item.name}` == regionArray[2])).code
                    const districtList: any[] = await getDistrict(cityCode, setDistrictList, setRegionObj);
                    const districtCode = districtList.find((item) => (`${item.type} ${item.name}` == regionArray[1])).code
                    const wardList: any[] = await getWard(districtCode, setWardList, setRegionObj);
                    const wardCode = wardList.find((item) => (`${item.type} ${item.name}` == regionArray[0])).code
                    setRegionObj({cityCode: cityCode, districtCode: districtCode, wardCode: wardCode})
                } else {
                    getCity(setCityList);
                }
                setShippingFeeList(result.data.shippingFee)
            } else {
                messageService.error(result.message)
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetAddressLoading(false);
        }
    }

    useEffect(() => {
        if (regionObj.cityCode && showSelectAddress) {
            setLongitude(0);
            setLatitude(0);
            getDistrict(regionObj.cityCode, setDistrictList, setRegionObj)
        }
    }, [regionObj.cityCode]);

    useEffect(() => {
        if (regionObj.districtCode && showSelectAddress) {
            setLongitude(0);
            setLatitude(0);
            getWard(regionObj.districtCode, setWardList, setRegionObj)
        }
    }, [regionObj.districtCode]);

    useEffect(() => {
        setRegionAddress(regionArray.filter(Boolean).join(", "));
        if (!showSelectAddress || !openAddressList) {
            if (regionArray.filter(Boolean).length == 3) {
                fetchCoordinate(regionArray.join(", "));
            }
        }
    }, [regionObj, showSelectAddress, openAddressList])

    const fetchCoordinate = async (address: string) => {
        let longitudeTmp = longitude;
        let latitudeTmp = latitude;
        if (longitude == 0 || latitude == 0) {
            const result = await getCoordinates(address);
            setLongitude(result.longitude);
            setLatitude(result.latitude);
            longitudeTmp = result.longitude;
            latitudeTmp = result.latitude;
        }
        
        const res = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${shopLongitude},${shopLatitude};${longitudeTmp},${latitudeTmp}?geometries=geojson&access_token=${import.meta.env.VITE_MB_API_KEY}`,
            {
                method: "GET",
                headers:{
                    Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
                }
            }
        )
        const data = await res.json();
        const dis = Math.round(data.routes[0].distance / 1000);
        setDistance(dis)
        const fee = shippingFeeList.find((item) => (item.minDistance <= dis && dis < item.maxDistance))
        setShippingFee(fee?.cost ?? 0);
        setShippingFeeId(fee?.id ?? -1);
    }

    useLayoutEffect(() => {
        const timeout = requestAnimationFrame(() => {
            getPositionItem();
        });

        return () => cancelAnimationFrame(timeout);
    }, [indexOfItem, showSelectAddress]);

    const getPositionItem = () => {
        const parentRect = parentElement.current?.getBoundingClientRect();
        const rect = refItem.current[indexOfItem]?.getBoundingClientRect();
        setPosition({
            xLeft: rect && parentRect ? (rect?.left - parentRect?.left) : null,
            width: rect?.width ?? null
        })
    }

    const getVoucher = async (productOrder: CartProduct[], totalPrice: number) => {
        try {
            const result = await getVoucherApi(user.accountId, productOrder.map((item) => (item.productId)), totalPrice)
            if (result.code == 0) {
                const vouchers: ShipVoucher[] = result.data.billAndShipVoucher.map((item: any) => (
                    {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        discountPercent: item.discountPercent,
                        startDate: dayjs(item.startDate),
                        endDate: dayjs(item.endDate),
                        description: item.description,
                        type: item.type, 
                        condition: item.condition
                    }
                ))
                setShipVoucherList(
                    vouchers.filter((item) => (
                        item.type == 2
                    )).sort((a, b) => {
                        const feeA = (a.discountPercent * shippingFee) / 100
                        const feeB = (b.discountPercent * shippingFee) / 100
                        return feeB - feeA
                    })
                )

                let productVoucher: ProductVoucher[] = vouchers.filter((item) => (item.type == 1 || item.type == 3)).map((item) => (
                    {
                        ...item,
                        productId: []
                    }
                ))
                const productVoucherId = productVoucher.map((item) => (item.id))
                for (const item of result.data.categoryVoucher) {
                    for (const voucher of item.voucher) {
                        if (!productVoucherId.includes(voucher.id)) {
                            productVoucher.push({
                                id: voucher.id,
                                code: voucher.code,
                                name: voucher.name,
                                discountPercent: voucher.discountPercent,
                                startDate: dayjs(voucher.startDate),
                                endDate: dayjs(voucher.endDate),
                                description: voucher.description,
                                type: voucher.type, 
                                condition: voucher.condition,
                                productId: voucher.type == 3 ? [item.productId] : []
                            })
                            productVoucherId.push(voucher.id)
                        } else {
                            if (voucher.type == 3) {
                                productVoucher = productVoucher.map((itemChild) => (
                                    itemChild.id == voucher.id ? {
                                        ...itemChild, productId: [...itemChild.productId, item.productId]
                                    } : itemChild
                                ))
                            }
                        }
                    }
                }
                let productIdType3 = [6, ...productVoucher.flatMap((item) => (item.productId.map((item) => (item))))]
                productIdType3 = Array.from(new Set(productIdType3))
                setProductVoucherList(
                    productVoucher.sort((a, b) => {
                        let feeA = 0;
                        let feeB = 0;
                        if (a.type == 1) {
                            feeA = (a.discountPercent * totalPrice) / 100
                        } else {
                            const totalProduct = productOrder.reduce((sum, current) => (
                                productIdType3.includes(current.productId) ? (
                                    current.discount ? sum + (current.discount * current.quantityOrder) : sum + (current.price * current.quantityOrder)
                                ) : (sum + 0)
                            ), 0)
                            setTotalPriceProductType3(totalProduct);
                            feeA = (a.discountPercent * totalProduct) / 100
                        }
                        
                        if (b.type == 1) {
                            feeB = (b.discountPercent * totalPrice) / 100
                        } else {
                            const totalProduct = productOrder.reduce((sum, current) => (
                                productIdType3.includes(current.productId) ? (
                                    current.discount ? sum + (current.discount * current.quantityOrder) : sum + (current.price * current.quantityOrder)
                                ) : (sum + 0)
                            ), 0)
                            feeB = (b.discountPercent * totalProduct) / 100
                        }
                        return feeB - feeA
                    })
                )
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        }
    }

    const applyVoucher = () => {
        const productVoucher = productVoucherList.find((item) => (item.code == voucherCode));
        if (productVoucher) {
            if (productVoucher.type == 1) {
                setProductDiscount(Math.round(((totalPrice * productVoucher.discountPercent) / 100) / 1000) * 1000)
            } else {
                setProductDiscount(Math.round(((totalPriceProductType3 * productVoucher.discountPercent) / 100) / 1000) * 1000)
            }
            setProductVoucherSelect(productVoucher.id)
        } else {
            const shipVoucher = shipVoucherList.find((item) => (item.code == voucherCode));
            if (shipVoucher) {
                setShipDiscount(Math.round(((shippingFee * shipVoucher.discountPercent) / 100) / 1000) * 1000)
                setShipVoucherSelect(shipVoucher.id)
            } else {
                messageService.error("Mã voucher không tồn tại")
            }
        }
    }

    useEffect(() => {
        setFinalPrice(totalPrice + shippingFee - productDiscount - shipDiscount)
    }, [totalPrice, shippingFee, productDiscount, shipDiscount])

    useEffect(() => {
        setHasValidate((prev) => (
            prev.map((item, index) => (index == 3 ? false : item))
        ))
    }, [regionAddress]) 
    const checkValidate = (): boolean => {
        let newArray = [...hasValidate]
        if (name == "") {
            newArray[0] = true
        }
        if (!/^\d{10}$/.test(phone)) {
            newArray[1] = true
        }
        if (detailAddress == "") {
            newArray[2] = true
        }
        if (regionAddress.split(", ").length != 3) {
            newArray[3] = true
        }
        setHasValidate(newArray)
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i]) {
                messageService.error("Nhập đầy đủ thông tin giao hàng");
                return true;
            }
        }
        return false;
    }

    const orderProduct = async () => {
        if (!checkValidate()) {
            setOrderProductLoading(true);
            try {
                let addressOrder: AddressInformation = {id: -1, phone: phone, name: name, address: detailAddress + "=" + regionAddress, longitude: longitude, latitude: latitude}
                if (addressFirst) {
                    const isSame = lodash.isEqual(addressOrder, {...addressFirst, id: -1})
                    if (isSame) {
                        addressOrder = addressFirst
                    }
                }
                let voucherUse: {
                    productVoucher: {voucherId: number, voucherCode: string, productId: number[]} | null,
                    shipVoucher: {voucherId: number, voucherCode: string} | null 
                } = {productVoucher: null, shipVoucher: null}
                if (productVoucherSelect != -1) {
                    const voucher = productVoucherList.find((item) => (item.id == productVoucherSelect));
                    voucherUse = {...voucherUse, productVoucher: {
                        voucherId: productVoucherSelect,
                        voucherCode: voucher?.code ?? "",
                        productId: voucher?.productId ?? []
                    }}
                }
                if (shipVoucherSelect != -1) {
                    const voucher = shipVoucherList.find((item) => (item.id == shipVoucherSelect));
                    voucherUse = {...voucherUse, shipVoucher: {
                        voucherId: shipVoucherSelect,
                        voucherCode: voucher?.code ?? ""
                    }}
                }
                const result = await orderProductApi(user.accountId, productOrder, addressOrder, totalPrice, dayjs().toISOString(), note, voucherUse, shippingFeeId, payMethod, finalPrice);
                setOrderProductLoading(false);
                if (result.code == 0) {
                    messageService.success(result.message);
                    navigate("/")
                    setOrderProductLoading(false);
                    if (productOrder.length > 0) {
                        localStorage.removeItem("productOrder")
                        if (productOrder[0].cartId != 0) {
                            setCart(prev => prev - productOrder.length);
                        }
                    }
                } else {
                    messageService.error(result.message);
                    setOrderProductLoading(false);
                }
                console.log(result.data);
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setOrderProductLoading(false);
            }
        }
    }

    return(
        <>
            <ConfigProvider theme={{
                components: {
                    ...configProvider,

                }
            }}>
                {
                    productOrder.length == 0 ? (
                        <>
                            <div>Không có sản phẩm nào được chọn</div>
                        </>
                    ) : (
                        <>
                            <Row className="pay-container" style={{padding: "30px 200px"}} onClick={() => {setShowSelectAddress(false)}}>
                                <Col span={12} style={{paddingRight: "30px"}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                                        <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                                <div style={{fontWeight: "600", fontSize: "20px"}}>Thông tin giao hàng</div>
                                                <div className="button-select-address" onClick={() => {setOpenAddressList(true)}}>Chọn địa chỉ khác</div>
                                            </div>
                                            {
                                                getAddressLoading ? (
                                                    <Skeleton active paragraph={{rows: 5}} />
                                                ) : (
                                                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                        <Input 
                                                            className="input-ant"
                                                            placeholder="Họ tên"
                                                            value={name}
                                                            status={`${hasValidate[0] ? "error" : ""}`}
                                                            onChange={(event) => {
                                                                setName(event.target.value)
                                                                setHasValidate((prev) => (
                                                                    prev.map((item, index) => (index == 0 ? false : item))
                                                                ))
                                                            }}
                                                        />
                                                        <Input 
                                                            className="input-ant"
                                                            placeholder="Số điện thoại"
                                                            value={phone}
                                                            status={`${hasValidate[1] ? "error" : ""}`}
                                                            onChange={(event) => {
                                                                setPhone(event.target.value)
                                                                setHasValidate((prev) => (
                                                                    prev.map((item, index) => (index == 1 ? false : item))
                                                                ))
                                                            }}
                                                        />
                                                        <Input 
                                                            className="input-ant"
                                                            placeholder="Số nhà, tên đường"
                                                            value={detailAddress}
                                                            status={`${hasValidate[2] ? "error" : ""}`}
                                                            onChange={(event) => {
                                                                setDetailAddress(event.target.value)
                                                                setHasValidate((prev) => (
                                                                    prev.map((item, index) => (index == 2 ? false : item))
                                                                ))
                                                            }}
                                                        />
                                                        <div style={{position: "relative"}}>
                                                            <Input 
                                                                style={{cursor: "default"}}
                                                                className={`input-ant ${showSelectAddress ? "input-active" : ""}`}
                                                                placeholder="Phường, Quận, Thành phố"
                                                                value={regionAddress}
                                                                status={`${hasValidate[3] ? "error" : ""}`}
                                                                readOnly
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setShowSelectAddress(!showSelectAddress);
                                                                }}
                                                            />
                                                            <AnimatePresence mode="wait">
                                                                {
                                                                    showSelectAddress && (
                                                                        <MotionDiv
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -10 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            style={{
                                                                                position: "absolute",
                                                                                backgroundColor: "white",
                                                                                top: "36px",
                                                                                left: "50%",
                                                                                width: "98%",
                                                                                padding: "10px",
                                                                                border: "1px solid rgba(0, 0, 0, 0.1)",
                                                                                boxShadow: "0 10px 20px 2px rgba(0, 0, 0, 0.3)",
                                                                                borderRadius: "10px",
                                                                                zIndex: 1000
                                                                            }}
                                                                            transformTemplate={(_, transform) => `translateX(-50%) ${transform}`}
                                                                        >
                                                                            <Row className="select-address-container">
                                                                                <Col span={24}>
                                                                                    <Row ref={parentElement}>
                                                                                        {
                                                                                            unitAddress.map((item, index) => (
                                                                                                <Col 
                                                                                                    key={index} 
                                                                                                    span={8} 
                                                                                                    style={{display: "flex", justifyContent: "center"}}
                                                                                                    ref={(element) => {refItem.current[index] = element}}
                                                                                                    onClick={(event) => {
                                                                                                        event.stopPropagation();
                                                                                                        if (index == 0) {
                                                                                                            setIndexOfItem(index)
                                                                                                        } 
                                                                                                        if (index == 1) {
                                                                                                            if (regionObj.cityCode != null) {
                                                                                                                setIndexOfItem(index)
                                                                                                            } else {
                                                                                                                messageService.error("Chọn Thành phố");
                                                                                                            }
                                                                                                        }
                                                                                                        if (index == 2) {
                                                                                                            if (regionObj.cityCode != null && regionObj.districtCode != null) {
                                                                                                                setIndexOfItem(index)
                                                                                                            } else {
                                                                                                                messageService.error("Chọn Thành phố và Quận")
                                                                                                            }
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    <div>{item}</div>
                                                                                                </Col>
                                                                                            ))
                                                                                        }
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24} style={{paddingTop: "8px", position: "relative", paddingBottom: "10px"}}>
                                                                                    <div style={{width: "100%", height: "1px", backgroundColor: "rgba(0, 0, 0, 0.2)"}}></div>
                                                                                    <div className="unit-address-underline" style={{width: `${position.width}px`, left: `${position.xLeft}px`}}></div>
                                                                                </Col>
                                                                                {
                                                                                    indexOfItem == 0 && (
                                                                                        <Col span={24} style={{maxHeight: "300px", overflowY: "auto"}}>
                                                                                            {
                                                                                                cityList.map((item, index) => (
                                                                                                    <div 
                                                                                                        key={index}
                                                                                                        className={`item-address ${item.code == regionObj.cityCode ? "address-active" : ""}`}
                                                                                                        onClick={(event) => {
                                                                                                            event.stopPropagation();
                                                                                                            setRegionObj((prev) => ({...prev, cityCode: item.code}))
                                                                                                            setRegionArray(["", "", `${item.type} ${item.name}`])
                                                                                                        }}
                                                                                                    >
                                                                                                        {`${item.type} ${item.name}`}
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </Col>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    indexOfItem == 1 && (
                                                                                        <Col span={24} style={{maxHeight: "300px", overflowY: "auto"}}>
                                                                                            {
                                                                                                districtList.map((item, index) => (
                                                                                                    <div 
                                                                                                        key={index}
                                                                                                        className={`item-address ${item.code == regionObj.districtCode ? "address-active" : ""}`}
                                                                                                        onClick={(event) => {
                                                                                                            event.stopPropagation();
                                                                                                            setRegionObj((prev) => ({...prev, districtCode: item.code}))
                                                                                                            setRegionArray((prev) => (
                                                                                                                prev.map((itemChild, indexChild) => (
                                                                                                                    indexChild == 0 ? "" : (indexChild == 1 ? `${item.type} ${item.name}` : itemChild)
                                                                                                                ))
                                                                                                            ))
                                                                                                        }}
                                                                                                    >
                                                                                                        {`${item.type} ${item.name}`}
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </Col>
                                                                                    )
                                                                                }
                                                                                {
                                                                                    indexOfItem == 2 && (
                                                                                        <Col span={24} style={{maxHeight: "300px", overflowY: "auto"}}>
                                                                                            {
                                                                                                wardList.map((item, index) => (
                                                                                                    <div 
                                                                                                        key={index}
                                                                                                        className={`item-address ${item.code == regionObj.wardCode ? "address-active" : ""}`}
                                                                                                        onClick={(event) => {
                                                                                                            event.stopPropagation();
                                                                                                            setRegionObj((prev) => ({...prev, wardCode: item.code}))
                                                                                                            setRegionArray((prev) => (
                                                                                                                prev.map((itemChild, indexChild) => (
                                                                                                                    indexChild == 0 ? `${item.type} ${item.name}` : itemChild
                                                                                                                ))
                                                                                                            ))
                                                                                                        }}
                                                                                                    >
                                                                                                        {`${item.type} ${item.name}`}
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </Col>
                                                                                    )
                                                                                }
                                                                            </Row>
                                                                        </MotionDiv>
                                                                    )
                                                                }
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            
                                        </div>
                                        <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                                <div style={{fontWeight: "600", fontSize: "20px"}}>Phương thức thanh toán</div>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                <Radio.Group
                                                    style={{display: "flex", flexDirection: "column", gap: "15px"}}
                                                    value={payMethod}
                                                    options={[
                                                        {value: 1, label: "Chuyển khoản qua ngân hàng"},
                                                        {value: 2, label: "Thanh toán khi nhận hàng"}
                                                    ]}
                                                    onChange={(event) => {
                                                        setPayMethod(event.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                                <div style={{fontWeight: "600", fontSize: "20px"}}>Ghi chú đơn hàng</div>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                <TextArea 
                                                    className="input-ant" 
                                                    placeholder="Nội dung ghi chú" 
                                                    autoSize={{minRows: 6}} 
                                                    value={note}
                                                    onChange={(event) => {
                                                        setNote(event.target.value);
                                                    }}    
                                                />
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
                                                    productOrder.map((item, index) => (
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
                                                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                                                        {
                                                                            item.discount && (
                                                                                <div style={{fontWeight: "600", fontSize: "18px"}}>{`${item.discount.toLocaleString("en-US")}đ`}</div>
                                                                            )
                                                                        }
                                                                        <div style={item.discount ? {color: "#afb6b5", textDecoration: "line-through"} : {fontWeight: "600", fontSize: "18px"}}>{`${item.price.toLocaleString("en-US")}đ`}</div>
                                                                    </div>
                                                                    <div>x{item.quantityOrder}</div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "15px"}}>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                                <div style={{fontWeight: "600", fontSize: "20px"}}>Mã khuyến mãi</div>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                                                <div style={{position: "relative", borderRadius: "20px", padding: "10px 50px", border: "1px solid rgba(0, 0, 0, 0.3)", cursor: "pointer"}} onClick={() => {setOpenVoucher(true)}}>
                                                    <div>Chọn mã</div>
                                                    <ChevronRight size={24} strokeWidth={1} style={{position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)"}} />
                                                    <TicketPercent size={24} strokeWidth={1} style={{position: "absolute", top: "50%", left: "15px", transform: "translateY(-50%)"}} />
                                                </div>
                                                <div style={{display: "flex", gap: "10px"}}>
                                                    <Input 
                                                        className="input-ant"
                                                        style={{height: "45.6px"}}
                                                        placeholder="Nhập mã"
                                                        value={voucherCode}
                                                        onChange={(event) => {
                                                            setVoucherCode(event.target.value)
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key == "Enter") {
                                                                applyVoucher()
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        style={{height: "45.6px", borderRadius: "20px"}}
                                                        variant="solid"
                                                        color="primary"
                                                        onClick={() => {
                                                            applyVoucher()
                                                        }}
                                                    >
                                                        Áp dụng
                                                    </Button>
                                                </div>
                                            </div>
                                            <div style={{width: "fit-content", display: "flex", gap: "20px"}}>
                                                {
                                                    productVoucherSelect != -1 && (
                                                        <div style={{padding: "5px 5px 5px 10px", border: "1px solid var(--color7)", display: "flex", alignItems: "center", gap: "10px", borderRadius: "20px"}}>
                                                            <div>{productVoucherList.find((item) => (item.id == productVoucherSelect))?.code}</div>
                                                            <X 
                                                                size={20} 
                                                                strokeWidth={1} 
                                                                style={{cursor: "pointer"}} 
                                                                onClick={() => {
                                                                    setProductVoucherSelect(-1);
                                                                    setProductDiscount(0);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    shipVoucherSelect != -1 && (
                                                        <div style={{padding: "5px 5px 5px 10px", border: "1px solid var(--color7)", display: "flex", alignItems: "center", gap: "10px", borderRadius: "20px"}}>
                                                            <div>{shipVoucherList.find((item) => (item.id == shipVoucherSelect))?.code}</div>
                                                            <X 
                                                                size={20} 
                                                                strokeWidth={1} 
                                                                style={{cursor: "pointer"}} 
                                                                onClick={() => {
                                                                    setShipVoucherSelect(-1);
                                                                    setShipDiscount(0);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div style={{backgroundColor: "white", padding: "20px 20px", borderRadius: "20px", boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: "20px"}}>
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "start"}}>
                                                <div style={{fontWeight: "600", fontSize: "20px"}}>Tóm tắt đơn hàng</div>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                    <div>Tổng tiền sản phẩm</div>
                                                    <div>{`${totalPrice.toLocaleString("en-US")}đ`}</div>
                                                </div>
                                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                    <div>Phí vận chuyển</div>
                                                    <div>{`${shippingFee.toLocaleString("en-US")}đ`}</div>
                                                </div>
                                                {
                                                    shipDiscount > 0 && (
                                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                            <div>Giảm giá phí vận chuyển</div>
                                                            <div className="text-danger">{`-${shipDiscount.toLocaleString("en-US")}đ`}</div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    productDiscount > 0 && (
                                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                            <div>Giảm giá sản phẩm</div>
                                                            <div className="text-danger">{`-${productDiscount.toLocaleString("en-US")}đ`}</div>
                                                        </div>
                                                    )
                                                }
                                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px"}}>
                                                    <div style={{fontWeight: "600"}}>Tổng thanh toán</div>
                                                    <div style={{fontWeight: "600"}}>{`${finalPrice.toLocaleString("en-US")}đ`}</div>
                                                </div>
                                                <div>
                                                    <Button
                                                        style={{width: "100%"}}
                                                        variant="solid"
                                                        color="primary"
                                                        size="large"
                                                        onClick={() => {
                                                            orderProduct();
                                                        }}
                                                    >
                                                        Đặt hàng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <AddressListModal 
                                open={openAddressList}
                                setOpen={setOpenAddressList}
                                setName={setName}
                                setPhone={setPhone}
                                setDetailAddress={setDetailAddress}
                                setRegionAddress={setRegionAddress}
                                setLongitude={setLongitude}
                                setLatitude={setLatitude}
                                setRegionArray={setRegionArray}
                                setRegionObj={setRegionObj}
                                setGetAddressLoading={setGetAddressLoading}
                                cityList={cityList}
                                setDistrictList={setDistrictList}
                                setWardList={setWardList}
                            />
                            <VoucherModal 
                                open={openVoucher}
                                setOpen={setOpenVoucher}
                                productVoucherList={productVoucherList}
                                shipVoucherList={shipVoucherList}
                                productVoucherSelect={productVoucherSelect}
                                setProductVoucherSelect={setProductVoucherSelect}
                                shipVoucherSelect={shipVoucherSelect}
                                setShipVoucherSelect={setShipVoucherSelect}
                                setShipDiscount={setShipDiscount}
                                setProductDiscount={setProductDiscount}
                                totalPriceProductType3={totalPriceProductType3}
                                totalPrice={totalPrice}
                                shippingFee={shippingFee}
                            />
                            <LoadingModal 
                                open={orderProductLoading}
                                message="Đang đặt hàng"
                            />
                        </>
                    )
                }
                
            </ConfigProvider>
        </>
    )
}

export default Pay;