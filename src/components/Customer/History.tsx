import { useContext, useEffect, useState, type JSX } from "react";
import { Button, Col, Row, Skeleton } from "antd";
import { Heart, ShoppingCart } from "lucide-react";
import type { FavouriteListProps, RawFavourite } from "../../interfaces/customerInterface";
import { messageService } from "../../interfaces/appInterface";
import LoadingModal from "../Other/LoadingModal";
import { favouriteDataProcess, getHistoryListApi } from "../../services/customerService";
import ProductionFavourite from "../Utilities/ProductionCard/ProductionFavourite";
import { UserContext } from "../../configs/globalVariable";

const History = (): JSX.Element => {
    const {user} = useContext(UserContext);
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);
    const [historyList, setHistoryList] = useState<FavouriteListProps[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        getFavouriteList();
    }, [currentPage])

    const getFavouriteList = async () => {
        setHistoryLoading(true);
        try {
            const result = await getHistoryListApi(user.accountId, currentPage);
            setHistoryLoading(false);
            if (result.code == 0) {
                const rawData: RawFavourite[] = result.data.history;
                if (result.data.count >= 0) {
                    setTotal(result.data.count);
                }
                const processedData = favouriteDataProcess(rawData);
                setHistoryList((prev) => ([...prev, ...processedData]));
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setHistoryLoading(false);
        }
    }
    const historyListt: {id: number, url: string, name: string, price: string}[] = [
        {
            id: 1,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760164494/pro_den_1_341c12ed4dea4f48b87b4081496dee66_grande_fqendz.jpg",
            name: "Váy midi kaki sọc 2 túi viền bèo",
            price: "409,500₫"
        },
        {
            id: 2,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760164450/pro_do_01_1_6f5781e0ee534b96b336c9428859b2a0_grande_epwdmr.jpg",
            name: "Đầm caro phối ren bèo cổ",
            price: "444,000₫"
        },
        {
            id: 3,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760164486/pro_kem_01_1_bb3d594ce19b4ab68945cb00b0793d68_grande_o8zn5u.jpg",
            name: "Chân váy dài lưng thun đính nơ hông",
            price: "555,000₫"
        },
        {
            id: 11,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760164453/pro_vang_01_1_e3263567b0534f23ab4743cc8eb2eff0_grande_yefhhk.jpg",
            name: "Đầm dài bèo cổ nhún viền smocking cách điệu",
            price: "755,000₫"
        },
        {
            id: 12,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101073/pro_kem_01_1_82c6568b8f2148acb48d7488460d30b4_grande_hdkdsk.jpg",
            name: "Áo sơ mi sheer tay dài phối bèo",
            price: "444,000₫"
        },
        {
            id: 13,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034357/pro_den_3_b5e52ae3d9e54b65bdf58a64be1dcf19_grande_fbf0qy.jpg",
            name: "Áo gile kẻ sọc thắt nơ thân trước",
            price: "213,000₫"
        },
        {
            id: 14,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031345/pro_luc_01_1_0af140c6cd3c4058b97970c80993d8c7_grande_dfmcdb.jpg",
            name: "Đầm midi form suông sát nách thắt nơ lưng",
            price: "476,000₫"
        },
        {
            id: 15,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101061/pro_den_1_ab9339c762134ec3926d86faaa116493_grande_gtnbcn.jpg",
            name: "Áo sát nách cổ bèo phối ren dây kéo sau",
            price: "395,000₫"
        },
    ]
    return (historyLoading && currentPage == 1) ? (
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
                                            historyList.map((item, index) => (
                                                <ProductionFavourite 
                                                    key={index} 
                                                    id={item.id}
                                                    productCard={item.productCard}
                                                    setFavouriteList={setHistoryList}
                                                    type="history"
                                                    setTotal={setTotal}
                                                    take={historyList.length < total ? historyList.length : -1}
                                                />
                                            ))
                                        }
                                    </Row>
                                </Col>
                                {
                                    historyList.length < total && (
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
                (historyLoading && currentPage != 1) && (
                    <LoadingModal
                        open={historyLoading}
                        message="Đang lấy dữ liệu"
                    />
                )
            }
        </>
    )
}

export default History;