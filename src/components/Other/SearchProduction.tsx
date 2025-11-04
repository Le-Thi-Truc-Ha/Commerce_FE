import { useContext, useEffect, useState, type JSX } from "react";
import { Button, Col, ConfigProvider, Input, Result, Row } from "antd";
import { Search, X } from "lucide-react";
import ProductionCard from "../Utilities/ProductionCard/ProductionCard";
import { configProvider, messageService, type ProductionCardProps } from "../../interfaces/appInterface";
import LoadingModal from "./LoadingModal";
import { findProductApi, productDataProcess } from "../../services/appService";
import { UserContext } from "../../configs/globalVariable";
import { getSessionKey } from "../../configs/axios";
import { setSessionKey } from "./Login";

const SearchProduction = (): JSX.Element => {
    const {user} = useContext(UserContext);
    const [findValue, setFindValue] = useState<string>("");
    const [hasSearch, setHasSearch] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productList, setProductList] = useState<ProductionCardProps[]>([]);
    const [seeMore, setSeeMore] = useState<boolean>(false);
    const [findResult, setFindResult] = useState<string>("");

    useEffect(() => {
        if (findValue != "") {
            findProduct()
        }
    }, [currentPage])

    const findProduct = async () => {
        setModalLoading(true);
        try {
            const rawData = localStorage.getItem("findResult");
            const productId = rawData ? JSON.parse(rawData).productId : null;
            const find = rawData ? JSON.parse(rawData).findValue : "";
            if (find == findValue) {
                const result = await findProductApi(user.isAuthenticated ? user.accountId : -1, findValue, productId, currentPage);
                setFindResult(findValue)
                if (result.code == 0) {
                    setHasSearch(true);
                    const rawProduct = result.data.product;
                    if (currentPage == 1) {
                        setProductList(productDataProcess(rawProduct));
                        setSeeMore(rawProduct.length < productId.length);
                    } else {
                        setProductList(prev => [...prev, ...productDataProcess(rawProduct)]);
                        setSeeMore((rawProduct.length + productList.length) < productId.length)
                    }
                } else {
                    setModalLoading(false);
                    messageService.error(result.message);
                }
            } else {
                // Xử lý kết quả, lưu productId và findValue vào local storage
                const result = await findProductApi(user.isAuthenticated ? user.accountId : -1, findValue, null, 1);
                setFindResult(findValue)
                if (result.code == 0) {
                    setCurrentPage(1);
                    setHasSearch(true);
                    const productId = result.data.productId;
                    const rawProduct = result.data.product;
                    setProductList(productDataProcess(rawProduct));
                    const payload = {findValue: findValue, productId: productId}
                    localStorage.setItem("findResult", JSON.stringify(payload))
                    setSeeMore(rawProduct.length < productId.length);
                    if (!user.isAuthenticated) {
                        const keyBeforeLogin = getSessionKey();
                        if (!keyBeforeLogin) {
                            setSessionKey(result.data.uuid, 30);
                        }
                    }
                } else {
                    setModalLoading(false);
                    messageService.error(result.message)
                }
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server")
        } finally {
            setModalLoading(false);
        }
    }
    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
                <Row className="search-production-container" style={{padding: "30px 0px"}}>
                    <Col span={24}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
                                <Input 
                                    className="input-ant"
                                    style={{width: "500px", height: "40px", paddingLeft: "40px", paddingRight: "35px", boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.2)"}}
                                    placeholder="Nhập nội dung tìm kiếm"
                                    value={findValue}
                                    onChange={(event) => {
                                        setFindValue(event.target.value);
                                    }}
                                    onKeyDown={async (event) => {
                                        if (event.key == "Enter") {
                                            setHasSearch(true);
                                            setCurrentPage(1);
                                            if (currentPage == 1) {
                                                await findProduct();
                                            }
                                        }
                                    }}
                                />
                                <Search size={24} strokeWidth={1} style={{position: "absolute", left: "10px"}} />
                                {
                                    findValue.length > 0 && (
                                        <X size={24} strokeWidth={1} style={{position: "absolute", right: "10px", cursor: "pointer", transition: "all 0.3s ease-in-out"}} onClick={() => setFindValue("")}/>
                                    )
                                }
                            </div>
                        </div>
                    </Col>
                    {
                        (hasSearch) && (
                            <Col span={24} style={{padding: "40px 0px 30px 70px"}}>
                                <div style={{fontSize: "20px"}}>{`Kết quả tìm kiếm cho "${findResult}"`}</div>
                            </Col>
                        )
                    }
                    {
                        (findResult != "" && productList.length == 0) ? (
                            <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                                <div style={{width: "94%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px"}}>
                                    <div style={{width: "60%", height: "400px", overflow: "hidden", display: "flex", justifyContent: "center"}}>
                                        <img style={{width: "100%", height: "100%", objectFit: "contain"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761485715/not-found_evpxnm.png" />
                                    </div>
                                    <div style={{fontSize: "20px", paddingLeft: "50px"}}>Không thấy kết quả</div>
                                </div>
                            </Col>
                        ) : (
                            <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                                <div style={{width: "94%"}}>
                                    <Row gutter={[0, 50]}>
                                        {
                                            productList.map((item, index) => (
                                                <ProductionCard 
                                                    key={index} 
                                                    productId={item.productId} 
                                                    url={item.url} 
                                                    name={item.name} 
                                                    price={item.price} 
                                                    star={item.star} 
                                                    discount={item.discount}
                                                    category={item.category}
                                                    isLike={item.isLike}
                                                    status={item.status}
                                                    saleFigure={item.saleFigure}
                                                />
                                            ))
                                        }
                                    </Row>
                                </div>
                            </Col>
                        )
                    }
                    
                    {
                        seeMore && (
                            <Col span={24} style={{display: "flex", justifyContent: "center", padding: "40px 0px 0px"}}>
                                <Button
                                    variant="solid"
                                    color="primary"
                                    size="large"
                                    onClick={() => {setCurrentPage(prev => prev + 1)}}
                                >
                                    Xem thêm
                                </Button>
                            </Col>
                        )
                    }
                </Row>
                {
                    modalLoading && (
                        <LoadingModal 
                            open={modalLoading}
                            message="Đang lấy dữ liệu"
                        />
                    )
                }
            </ConfigProvider>
        </>
    )
}

export default SearchProduction;