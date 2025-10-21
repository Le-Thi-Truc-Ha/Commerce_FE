import { useContext, useEffect, useState, type JSX } from "react";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import { Heart, HeartOff, ShoppingCart, Star } from "lucide-react";
import { Col } from "antd";
import "./ProductionFavourite.scss";
import { UserContext } from "../../../configs/globalVariable";
import { addFavouriteApi, deleteFavouriteApi, favouriteDataProcess } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";
import type { FavouriteListProps, ProductionFavouriteProps, RawFavourite } from "../../../interfaces/customerInterface";
import LoadingModal from "../../Other/LoadingModal";

const ProductionFavourite = ({id, productCard, setFavouriteList, type, setTotal, take}: ProductionFavouriteProps): JSX.Element => {
    const navigate = useNavigate();
    const {user, setPathBeforeLogin} = useContext(UserContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLikeState, setIsLikeState] = useState<boolean>(productCard.isLike);
    
    const addFavourite = async () => {
        if (user.isAuthenticated) {
            setLoading(true)
            try {
                const result: BackendResponse = await addFavouriteApi(user.accountId, productCard.productId)
                setLoading(false);
                if (result.code == 0) {
                    setIsLikeState(true);
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server")
            } finally {
                setLoading(false);
            }
        } else {
            navigate("/login");
            setPathBeforeLogin(location.pathname);
        }
    }
    const deleteFavourite = async () => {
        if (user.isAuthenticated) {
            setLoading(true);
            try {
                const result: BackendResponse = await deleteFavouriteApi(user.accountId, productCard.productId, take)
                setLoading(false);
                if (result.code == 0) {
                    if (type == "history") {
                        setIsLikeState(false);
                    } else {
                        let processedData: FavouriteListProps[] = [];
                        if (result.data) {
                            const rawData: RawFavourite[] = result.data;
                            processedData = favouriteDataProcess(rawData);
                        }
                        setTotal((prev) => {return prev - 1})
                        setFavouriteList((prev) => {
                            return [...prev.filter((item) => (item.id != id)), ...processedData]
                        })
                    }
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server")
            } finally {
                setLoading(false);
            }
        } else {
            navigate("/login");
            setPathBeforeLogin(location.pathname);
        }
    }
    return(
        <>
            <Col title={productCard.name} className="production-favourite-container" span={6} key={id}>
                <div className="item-card" onClick={() => {productCard.status == 1 ? navigate(`/all-production/${productCard.category}/${productCard.productId}`) : messageService.error("Sản phẩm đã dừng bán")}}>
                    <div>
                        <div style={{width: "100%", height: "200px", overflow: "hidden"}}>
                            <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={productCard.url} />
                        </div>
                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                            <div style={{textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0px 10px 5px"}}>{productCard.name}</div>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                    {
                                        productCard.discount && (
                                            <div style={{fontSize: "16px", fontWeight: 600}} className="text-danger">{productCard.discount}</div>
                                        )
                                    }
                                    <div style={{fontSize: `${!productCard.discount ? "16px" : "14px"}`, fontWeight: `${!productCard.discount ? "600" : ""}`, textDecoration: `${productCard.discount ? "line-through" : ""}`}}>{`${productCard.price.toLocaleString("en-US")}đ`}</div>
                                </div>
                                {
                                    productCard.star > 0 ? (
                                        <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                            <Star size={20} strokeWidth={1} fill="#fadb14" stroke="#fadb14" />
                                            <div style={{fontSize: "16px"}}>{productCard.star}</div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", gap: "10px", justifyContent: "center", paddingTop: "10px", position: "absolute", bottom: "-35px", left: "50%", transform: "translateX(-50%)"}}>
                    <div className="icon-background">
                        {
                            isLikeState ? (
                                <HeartOff size={20} strokeWidth={1} color="white" onClick={() => {deleteFavourite()}} />
                            ) : (
                                <Heart size={20} strokeWidth={1} color="white" onClick={() => {addFavourite()}} />
                            )
                        }
                    </div>
                    {
                        productCard.status == 1 && (
                            <div className="icon-background">
                                <ShoppingCart size={20} strokeWidth={1} color="white" />
                            </div>
                        )
                    }
                </div>
                {
                    productCard.status == 2 && (
                        <div style={{position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", width: "150px", height: "150px", borderRadius: "50%", top: "50%", transform: "translateY(-50%)", cursor: "pointer"}}>
                            <div style={{fontSize: "22px"}}>Dừng bán</div>
                        </div>
                    )
                }
            </Col>
            {
                loading && (
                    <LoadingModal
                        message="Đang lưu"
                        open={loading}
                    />
                )
            }
        </>
    )
}

export default ProductionFavourite;