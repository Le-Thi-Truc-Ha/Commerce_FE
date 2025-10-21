import { useEffect, useState, type JSX } from "react";
import "./AllProduction.scss";
import { Col, ConfigProvider, Divider, Row } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const AllProduction = (): JSX.Element => {
    const navigate = useNavigate();
    const {category} = useParams();
    const [categoryActive, setCategoryActive] = useState<number>(-1);
    const [sortOptions, setSortOptions] = useState<string[]>(["Mới nhất", "Bán chạy", "Giá tăng dần", "Giá giảm dần"])
    const [currentSort, setCurrentSort] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const categories: {name: string, path: string, url: string}[] = [
        {name: "Áo", path: "shirt", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751103/tshirt_enlypz.png"},
        {name: "Quần", path: "pant", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/pants_yfrgrx.png"},
        {name: "Đầm", path: "dress", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751847/dress_tvwba9.png"},
        {name: "Váy", path: "skirt", url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1759751848/skirt_tbxhg5.png"}
    ]

    useEffect(() => {
        if (category == "shirt") {
            setCategoryActive(0);
        } else if (category == "pant") {
            setCategoryActive(1);
        } else if (category == "dress") {
            setCategoryActive(2);
        } else if (category == "skirt") {
            setCategoryActive(3);
        } else {
            setCategoryActive(-1);
        }
    }, [category])

    const navigateCategories = (indexCategory: number) => {
        const pathCategory = categories[indexCategory].path;
        if (!pathCategory) {
            return;
        }
        setCurrentPage(1);
        setCategoryActive(indexCategory);
        navigate(`/all-production/${pathCategory}`);
    }

    return(
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            borderRadius: 15,
                            activeBorderColor: "var(--color6)",
                            activeShadow: "0 0 0 2px var(--color2)",
                            hoverBorderColor: "var(--color4)",
                        },
                        DatePicker: {
                            borderRadius: 15,
                            activeBorderColor: "var(--color6)",
                            activeShadow: "0 0 0 2px var(--color2)",
                            hoverBorderColor: "var(--color4)",
                        },
                        Select: {
                            borderRadius: 15,
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
                            colorSplit: "rgba(0, 0, 0, 0.2)",
                        }
                    }
                }}
            >
                <Row className="all-product-container">
                    <Col span={24} style={{paddingTop: "30px", display: "flex", justifyContent: "center"}}>
                        <div style={{width: "90%", backgroundColor: "white", padding: "20px", borderRadius: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                            <div style={{fontFamily: "Prata", fontSize: "30px", width: "100%", textAlign: "center", paddingBottom: "20px"}}>Danh mục</div>
                            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "80px"}}>
                                {
                                    categories.map((item, index) => (
                                        <div className={`${categoryActive == index ? "category-active" : ""} category`} key={index} onClick={() => {navigateCategories(index)}}>
                                            <img className="icon-category" loading="eager" src={item.url} />
                                            <div className="name-category">{item.name}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </Col>
                    {
                        categoryActive == -1 ? (
                            <Col span={24} style={{padding: "40px 0px 10px 0px"}}>
                                <Divider><div style={{display: "inline-block", fontFamily: "Prata", fontSize: "30px"}}>Tất cả sản phẩm</div></Divider>
                            </Col>
                        ) : (
                            <Col span={24} style={{padding: "40px 0px 10px 0px"}}>
                                <Divider><div style={{display: "inline-block", fontFamily: "Prata", fontSize: "30px"}}>{categories[categoryActive].name}</div></Divider>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <div style={{display: "flex", alignItems: "center", gap: "20px", padding: "0px 70px 40px"}}>
                            <div style={{fontFamily: "Prata", fontSize: "20px"}}>Sắp xếp theo:</div>
                            <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
                                {
                                    sortOptions.map((item, index) => (
                                        <div 
                                            className={`sort-option ${currentSort == index ? "sort-active" : ""}`} 
                                            key={index} 
                                            onClick={() => {
                                                setCurrentSort(index);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {item}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </Col>
                    <Col span={24} style={{paddingBottom: "40px"}}>
                        <Outlet context={{currentSort, currentPage, setCurrentPage}} />
                    </Col>
                </Row>
            </ConfigProvider>
        </>
    )
}

export default AllProduction;