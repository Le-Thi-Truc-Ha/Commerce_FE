import { useContext, useEffect, useState, type JSX } from "react";
import { Button, Col, Row, Skeleton } from "antd";
import { messageService } from "../../interfaces/appInterface";
import { favouriteDataProcess, getFavouriteListApi } from "../../services/customerService";
import { UserContext } from "../../configs/globalVariable";
import ProductionFavourite from "../Utilities/ProductionCard/ProductionFavourite";
import type { FavouriteListProps, RawFavourite } from "../../interfaces/customerInterface";
import LoadingModal from "../Other/LoadingModal";

const Favourite = (): JSX.Element => {
    const {user} = useContext(UserContext);
    const [getFavouriteLoading, setGetFavouriteLoading] = useState<boolean>(false);
    const [favouriteList, setFavouriteList] = useState<FavouriteListProps[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        getFavouriteList();
    }, [currentPage])

    const getFavouriteList = async () => {
        setGetFavouriteLoading(true);
        try {
            const result = await getFavouriteListApi(user.accountId, currentPage);
            setGetFavouriteLoading(false);
            if (result.code == 0) {
                const rawData: RawFavourite[] = result.data.favourite;
                if (result.data.count >= 0) {
                    setTotal(result.data.count);
                }
                const processedData = favouriteDataProcess(rawData);
                setFavouriteList((prev) => ([...prev, ...processedData]));
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetFavouriteLoading(false);
        }
    }
    
    return (getFavouriteLoading && currentPage == 1) ? (
        <Skeleton active paragraph={{rows: 10}} />
    ) : (
        <>
            <Row>
                <Col span={24} style={{minHeight: "calc(100vh - 130px)"}}>
                    {
                        total > 0 ? (
                            <Row gutter={[0, 30]}>
                                <Col span={24} style={{paddingBottom: "40px"}}>
                                    <Row gutter={[0, 90]} style={{display: "flex", padding: "10px 30px"}}>
                                        {
                                            favouriteList.map((item, index) => (
                                                <ProductionFavourite 
                                                    key={index} 
                                                    id={item.id}
                                                    productCard={item.productCard}
                                                    setFavouriteList={setFavouriteList}
                                                    type="favourite"
                                                    setTotal={setTotal}
                                                    take={favouriteList.length < total ? favouriteList.length : -1}
                                                />
                                            ))
                                        }
                                    </Row>
                                </Col>
                                {
                                    favouriteList.length < total && (
                                        <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                size="large"
                                                onClick={() => {setCurrentPage((prev) => {return prev + 1})}}
                                            >
                                                Xem thêm
                                            </Button>
                                        </Col>
                                    )
                                }
                            </Row>
                        ) : (
                            <div style={{position: "absolute", top: "50%", left: "50%", zIndex: 1, transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <div style={{width: "300px", height: "300px", overflow: "hidden"}}>
                                    <img style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "blur(3px)"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1760129523/no-data_q4r0yj.png" />
                                </div>
                                <div style={{color: "rgba(0, 0, 0, 0.6)", fontSize: "25px"}}>Không có dữ liệu</div>
                            </div>
                        )
                    }
                </Col>
            </Row>
            {
                (getFavouriteLoading && currentPage != 1) && (
                    <LoadingModal 
                        message="Đang lấy dữ liệu"
                        open={getFavouriteLoading}
                    />
                )
            }
        </>
    )
}

export default Favourite;