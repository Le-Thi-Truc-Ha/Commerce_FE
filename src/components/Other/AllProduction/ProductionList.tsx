import { useContext, useEffect, useState, type Dispatch, type JSX, type SetStateAction } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { messageService, type ProductionCardProps, type RawProduction } from "../../../interfaces/appInterface";
import { Button, Col, Row, Skeleton } from "antd";
import LoadingModal from "../LoadingModal";
import { getProductApi, productDataProcess } from "../../../services/appService";
import { UserContext } from "../../../configs/globalVariable";
import ProductionCard from "../../Utilities/ProductionCard/ProductionCard";

const ProductList = (): JSX.Element => {
    const {user} = useContext(UserContext);

    const {category} = useParams();
    const {currentSort, currentPage, setCurrentPage} = useOutletContext<{currentSort: number, currentPage: number, setCurrentPage: Dispatch<SetStateAction<number>>}>();

    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [dataProcessed, setDataProcessed] = useState<ProductionCardProps[]>([]);
    const [total, setTotal] = useState<number>(0);

    const categories: string[] = ["all", "shirt", "pant", "dress", "skirt"]

    useEffect(() => {
        console.log(currentPage);
        console.log(category);
        console.log(currentSort);
        getProduct()
    }, [category, currentPage, currentSort]);

    const getProduct = async () => {
        if (currentPage == 1) {
            setSkeletonLoading(true);
        } else {
            setModalLoading(true);
        }
        try {
            const result = await getProductApi(user.isAuthenticated ? user.accountId : -1, categories.indexOf(category ?? "all"), currentSort, currentPage);
            console.log(result.data);
            if (result.code == 0) {
                const rawData: RawProduction[] = result.data.product;
                if (currentPage == 1) {
                    setTotal(result.data.count)
                    setDataProcessed(productDataProcess(rawData));
                } else {
                    setDataProcessed((prev) => (
                        [...prev, ...productDataProcess(rawData)]
                    ))
                }
                
                setSkeletonLoading(false);
                setModalLoading(false);
            } else {
                setSkeletonLoading(false);
                setModalLoading(false);
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setSkeletonLoading(false);
            setModalLoading(false);
        }
    }

    return skeletonLoading ? (
        <Skeleton active paragraph={{rows: 10}} style={{padding: "0px 60px"}} />
    ) : (
        <>
            <Row>
                <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                    <div style={{width: "94%"}}>
                        <Row gutter={[0, 50]}>
                            {
                                dataProcessed.map((item, index) => (
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
                {
                    dataProcessed.length < total && (
                        <Col span={24} style={{display: "flex", justifyContent: "center", paddingTop: "40px"}}>
                            <Button
                                color="primary"
                                variant="solid"
                                size="large"
                                onClick={() => {setCurrentPage((prev) => (prev + 1))}}
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
        </>
    )
}

export default ProductList