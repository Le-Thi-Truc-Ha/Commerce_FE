import { useState, type JSX } from "react";
import "./Home.scss";
import { Button, Col, ConfigProvider, Divider, Row } from "antd";
import { ArrowLeft, ArrowRight, Heart, ShoppingCart } from "lucide-react";
import ProductionCard from "../Utilities/ProductionCard/ProductionCard";

const Home = (): JSX.Element => {
    const [bannerActive, setBannerActive] = useState<number>(0);

    const urlBanners = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039590/Beige_Aesthetic_New_Arrival_Fashion_Banner_Landscape_vqsazn.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039590/Gray_and_Beige_Modern_Fashion_Banner_swwy4s.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039436/Peach_Orange_and_Brown_Illustrative_Autumn_Big_Sale_Promotion_Banner_Landscape_bzuoru.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039436/Brown_and_White_Modern_Fashion_Collection_Banner_Landscape_hadcta.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039435/Beige_and_Brown_Minimalist_New_Style_Collection_Banner_1_lbtce5.png",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1759039435/Beige_and_Brown_Minimalist_New_Style_Collection_Banner_swnotc.png"   
    ]

    const categories: {name: string, url: string}[] = [
        {name: "Áo", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751103/tshirt_enlypz.png"},
        {name: "Quần", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/pants_yfrgrx.png"},
        {name: "Váy", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751847/dress_tvwba9.png"},
        {name: "Đầm", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/skirt_tbxhg5.png"},
        {name: "Giày", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/high-heels_nsomr4.png"},
        {name: "Túi", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/handbag_sge74h.png"},
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

    const nameProduction: string[] = [
        "Áo kiểu tay ngắn cổ sơ mi phối ren", "Đầm mini 2 dây thêu hoa form suông phối bèo",
        "Đầm midi form suông sát nách thắt nơ lưng", "Quần ống suông lưng cao dây kéo sau",
        "Đầm midi sát nách rút nhún ngực thun eo", "Áo thun crop 3 lỗ cổ thuyền",
        "Áo thun crop tay ngắn cổ V cài nút", "Áo thun ôm 2 dây cơ bản"
    ]
    const priceProduction: string[] = [
        "177,500₫", "556,000₫",
        "476,000₫", "445,500₫",
        "595,000₫", "124,000₫",
        "153,000₫", "175,500₫"
    ]
    const imageProduction: string[] = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031339/pro_trang_2_4c261b702dd74bf58325a21830e364ce_grande_nyfzhr.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031343/pro_hoa_01_1_6cb772274f3544d989e5014291f40455_grande_ptdi0v.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031345/pro_luc_01_1_0af140c6cd3c4058b97970c80993d8c7_grande_dfmcdb.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031348/pro_luc_01_1_fc8d49a109c74088ada562dafe6f2341_grande_nsz4lq.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031350/pro_hong_05_1_1bb33f68add045ed947ed49fce9fcb70_grande_aqy9uq.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031352/pro_den_1_20113637fef04182868296ccdf4b4eae_grande_yj3mc4.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031355/pro_nau_01_4_adef39546c694d7eb19d9eb2ab1ba7db_grande_rgn2y5.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031357/pro_nau_01_2_afb7429972b34433b1a65849244b335e_grande_emuttg.jpg"
    ]

    const nameRecommend: string[] = [
        "Áo tơ thêu sát nách cổ tròn phối ren đính nút gỗ", "Áo thun hoa trễ vai tay dài viền ren đính nơ",
        "Váy skort cơ bản kẻ sọc", "Áo gile kẻ sọc thắt nơ thân trước",
        "Áo decoup tay phồng cổ tròn viền ren", "Quần culotte xếp li hông",
        "Áo blazer form cơ bản tay dài 2 túi", "Áo thun 4 chiều form basic tay ngắn"
    ]
    const priceRecommend: string[] = [
        "364,000₫", "265,500₫",
        "213,000₫", "213,000₫",
        "355,000₫", "364,000₫",
        "556,000₫", "204,000₫"
    ]
    const imageRecommend: string[] = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034348/pro_hong_01_2_91fa9ebd5e7448e3a11f151f19b9e8ef_grande_h86y3i.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034350/pro_den_1_fd131a81abbf42c1b1e7868ad99fef17_grande_r5txmz.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034352/pro_trang_4_6188e6cde05c40ce98f7e65c19fc7011_grande_w0byvi.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034357/pro_den_3_b5e52ae3d9e54b65bdf58a64be1dcf19_grande_fbf0qy.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034355/pro_nau_02_2_69885c0c4ae549f784aa67539a1bd84b_grande_adl8g3.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034359/pro_den_3_b8bbfb2ca9eb4ec1979f93041d65a3dd_grande_nye8yu.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034361/pro_nau_02_2_7d4060a2227a4752b0b63c3085115cbd_grande_fhjfrz.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034364/pro_xanh_la_02_2_1f6d681e5b90406297ad49dc9ad4e850_grande_gbmcbx.jpg"
    ]

    
    
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
                                    <div className="category" key={index}>
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
                                nameProduction.map((item, index) => (
                                    <ProductionCard key={index} url={imageProduction[index]} name={item} price={priceProduction[index]} />
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
                    <div style={{width: "94%"}}>
                        <Row gutter={[0, 50]}>
                            {
                                nameRecommend.map((item, index) => (
                                    <ProductionCard key={index} url={imageRecommend[index]} name={item} price={priceRecommend[index]} />
                                ))
                            }
                        </Row>
                    </div>
                </Col>
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
                        >
                            Xem thêm
                        </Button>
                    </ConfigProvider>
                </Col>
            </Row>
        </>
    )
}

export default Home;