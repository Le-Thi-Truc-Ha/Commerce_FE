import { useContext, useEffect, useState, type JSX } from "react";
import "./Home.scss";
import { Button, Col, ConfigProvider, Divider, Row } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductionCard from "../Utilities/ProductionCard/ProductionCard";
import { useNavigate } from "react-router-dom";
import { messageService, type BackendResponse, type ProductionCardProps, type RawProduction } from "../../interfaces/appInterface";
import { getBestSellerApi, getMoreRecommendApi, getRecommendApi, productDataProcess, trainLightFMApi } from "../../services/appService";
import Loading from "./Loading";
import { UserContext } from "../../configs/globalVariable";
import LoadingModal from "./LoadingModal";

const Home = (): JSX.Element => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const [bannerActive, setBannerActive] = useState<number>(0);
    const [bestSellerLoading, setBestSellerLoading] = useState<boolean>(false);
    const [bestSeller, setBestSeller] = useState<ProductionCardProps[]>([]);
    const [openLoading, setOpenLoading] = useState<boolean>(false);
    const [productLength, setProductLength] = useState<number>(0);
    const [recommendProduct, setRecommendProduct] = useState<ProductionCardProps[]>([]);

    const urlBanners = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039590/Beige_Aesthetic_New_Arrival_Fashion_Banner_Landscape_vqsazn.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039590/Gray_and_Beige_Modern_Fashion_Banner_swwy4s.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039436/Peach_Orange_and_Brown_Illustrative_Autumn_Big_Sale_Promotion_Banner_Landscape_bzuoru.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039436/Brown_and_White_Modern_Fashion_Collection_Banner_Landscape_hadcta.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039435/Beige_and_Brown_Minimalist_New_Style_Collection_Banner_1_lbtce5.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039435/Beige_and_Brown_Minimalist_New_Style_Collection_Banner_swnotc.png"   
    ]

    const categories: {name: string, path: string, url: string}[] = [
        {name: "Áo", path: "shirt",  url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751103/tshirt_enlypz.png"},
        {name: "Quần", path: "pant", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/pants_yfrgrx.png"},
        {name: "Đầm", path: "dress", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751847/dress_tvwba9.png"},
        {name: "Váy", path: "skirt", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/skirt_tbxhg5.png"}    
    ]

    const controlSlider = (nameButton: string) => {
        if (nameButton == "left") {
            if (bannerActive == 0) {
                setBannerActive(urlBanners.length - 1);
            } else {
                setBannerActive(bannerActive - 1)
            }
        } else {
            if (bannerActive == urlBanners.length - 1) {
                setBannerActive(0);
            } else {
                setBannerActive(bannerActive + 1)
            }
        }
    }

    useEffect(() => {
        getBestSeller();
        getRecommend();
    }, [])

    const getBestSeller = async () => {
        setBestSellerLoading(true);
        try {
            const result: BackendResponse = await getBestSellerApi(user.isAuthenticated ? user.accountId : -1);
            if (result.code == 0) {
                const rawData: RawProduction[] = result.data;
                setBestSeller(productDataProcess(rawData));
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        }
    }

    const getRecommend = async () => {
        try {
            let productRecent: number[] = [];
            const now = new Date();
            const today3am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0).getTime();
            const value = localStorage.getItem("productRecent");

            if (value) {
                const item: {createAt: number, productRecent: number[]} = JSON.parse(value);
                if (item.createAt < today3am) {
                    localStorage.removeItem("productRecent");
                } else {
                    productRecent = item.productRecent;
                }
            } 
            const result = await getRecommendApi(user.accountId, productRecent);
            if (result.code == 0) {
                const rawData: RawProduction[] = result.data.productInfomation;
                setRecommendProduct(productDataProcess(rawData));
                localStorage.setItem("recommend", JSON.stringify(result.data.productId));
                setProductLength(result.data.productId.length);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở service");
        } finally {
            setBestSellerLoading(false);
        }
    }

    const getMoreRecommend = async () => {
        setOpenLoading(true);
        try {
            const productIdString = localStorage.getItem("recommend");
            const productIdList: number[] = productIdString ? JSON.parse(productIdString) : [];

            const result = await getMoreRecommendApi(productLength > 0 ? productIdList.slice(recommendProduct.length, recommendProduct.length + 8) : [], user.accountId);
            if (result.code == 0) {
                const rawData: RawProduction[] = result.data;
                setRecommendProduct((prev) => (
                    [...prev, ...productDataProcess(rawData)]
                ));
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở service");
        } finally {
            setOpenLoading(false);
        }
    }
    
    return(
        <>
            <Row className="home-container">
                <Col span={24}>
                    <div style={{position: "relative", width: "100%"}}>
                        <div style={{width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f4f4"}}>
                            <div style={{height: "90%", width: "100%"}}>
                                <div style={{width: "100%", height: "100%"}}>
                                    <div style={{position: "relative", width: "100%", height: "100%"}}>
                                        {urlBanners.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                loading="eager"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    maxHeight: "100%", 
                                                    height: "fit-content", 
                                                    maxWidth: "100%",
                                                    objectFit: "contain",
                                                    objectPosition: "center",
                                                    borderRadius: "20px",
                                                    boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)",
                                                    opacity: bannerActive === index ? 1 : 0,
                                                    transition: "opacity 0.5s ease"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div style={{width: "100%", position: "absolute", bottom: "5px", display: "flex", justifyContent: "center", gap: "15px"}}>
                            {
                                urlBanners.map((_, index) => (
                                    <div 
                                        key={index} 
                                        className={`indicator ${bannerActive == index ? "indicator-active" : ""}`}
                                        onClick={() => {setBannerActive(index)}}
                                    ></div>
                                ))
                            }
                        </div>
                        <div style={{width: "100%", position: "absolute", top: "50%", transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", padding: "0px 30px"}}>
                            <div className="background-control" onClick={() => {controlSlider("left")}}>
                                <ArrowLeft size={24} strokeWidth={1} stroke="white" />
                            </div>
                            <div className="background-control" onClick={() => {controlSlider("right")}}>
                                <ArrowRight size={24} strokeWidth={1} stroke="white" />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={24} style={{paddingTop: "30px", display: "flex", justifyContent: "center"}}>
                    <div style={{width: "90%", backgroundColor: "white", padding: "20px", borderRadius: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                        <div style={{fontFamily: "Prata", fontSize: "30px", width: "100%", textAlign: "center", paddingBottom: "20px"}}>Danh mục</div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "80px"}}>
                            {
                                categories.map((item, index) => (
                                    <div className="category" key={index} onClick={() => {navigate(`/all-production/${item.path}`)}}>
                                        <img className="icon-category" loading="eager" src={item.url} />
                                        <div className="name-category">{item.name}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Col>
                <Col span={24} style={{padding: "50px 00px 40px 0px"}}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Divider: {
                                    colorSplit: "rgba(0, 0, 0, 0.2)",
                                }
                            }
                        }}
                    >
                        <Divider><div style={{fontFamily: "Prata", fontSize: "30px"}}>Sản phẩm bán chạy</div></Divider>
                    </ConfigProvider>
                </Col>
                <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                    <div style={{width: "94%"}}>
                        <Row gutter={[0, 50]}>
                            {
                                bestSeller.map((item, index) => (
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
                <Col span={24} style={{padding: "50px 00px 40px 0px"}}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Divider: {
                                    colorSplit: "rgba(0, 0, 0, 0.2)",
                                }
                            }
                        }}
                    >
                        <Divider><div style={{fontFamily: "Prata", fontSize: "30px"}}>Sản phẩm gợi ý</div></Divider>
                    </ConfigProvider>
                </Col>
                <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                    <div style={{width: "94%", display: "flex", justifyContent: "center"}}>
                        <Row gutter={[0, 50]}>
                            {
                                recommendProduct.map((item, index) => (
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
                        {/* <div>
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={() => {
                                    callLightFM()
                                }}
                            >
                                Test
                            </Button>
                        </div> */}
                    </div>
                </Col>
                {
                    recommendProduct.length < productLength && (
                        <Col span={24} style={{display: "flex", justifyContent: "center", padding: "40px 0px 0px"}}>
                            <ConfigProvider
                                theme={{
                                    components: {
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
                                        }
                                    }
                                }}
                            >
                                <Button
                                    variant="solid"
                                    color="primary"
                                    size="large"
                                    onClick={() => {
                                        getMoreRecommend()
                                    }}
                                >
                                    Xem thêm
                                </Button>
                            </ConfigProvider>
                        </Col>
                    )
                }
            </Row>
            <LoadingModal 
                open={openLoading}
                message="Đang lấy dữ liệu"
            />
            {
                bestSellerLoading && (
                    <Loading />
                )
            }
        </>
    )
}

export default Home;