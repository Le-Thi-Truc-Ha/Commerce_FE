import { Col } from "antd";
import { Heart, HeartOff, ShoppingCart, Star } from "lucide-react";
import { useContext, useState, type JSX } from "react";
import { messageService, type BackendResponse, type ProductionCardProps } from "../../../interfaces/appInterface";
import "./ProductionCard.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../configs/globalVariable";
import { addFavourite, addFavouriteApi, deleteFavourite, deleteFavouriteApi } from "../../../services/customerService";
import LoadingModal from "../../Other/LoadingModal";

const ProductionCard = ({productId, url, name, price, star, discount, category, isLike, status, saleFigure}: ProductionCardProps): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, setPathBeforeLogin} = useContext(UserContext);
    const [isLikeState, setIsLikeState] = useState<boolean>(isLike);
    const [loading, setLoading] = useState<boolean>(false);

    const navigateProductionDetail = () => {
        navigate(`/all-production/${category}/${productId}`);
    }
    return(
        <>
            <Col className="production-card-container" span={6} style={{display: "flex", justifyContent: "center", position: "relative"}}>
                <div title={name} className="item-card" onClick={() => {navigateProductionDetail()}}>
                    <div style={{width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={url} />
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "100%", flex: 1}}>
                        <div style={{fontSize: "20px", textAlign: "center", padding: "0px 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%"}}>{name}</div>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                                {
                                    discount && (
                                        <div style={{fontSize: "20px", fontWeight: 600}} className="text-danger">{discount}</div>
                                    )
                                }
                                <div style={{fontSize: `${!discount ? "20px" : ""}`, fontWeight: `${!discount ? "600" : ""}`, textDecoration: `${discount ? "line-through" : ""}`}}>{`${price.toLocaleString("en-US")}đ`}</div>
                            </div>
                            {
                                star > 0 ? (
                                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                        <Star size={25} strokeWidth={1} fill="#fadb14" stroke="#fadb14" />
                                        <div style={{fontSize: "20px"}}>{star}</div>
                                    </div>
                                ) : (
                                    <div></div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="background-enjoy">
                    {
                        !isLikeState ? (
                            <Heart size={22} strokeWidth={1} color="white" onClick={() => {addFavourite(user, setLoading, productId, setIsLikeState, navigate, setPathBeforeLogin)}} />
                        ) : (
                            <HeartOff size={22} strokeWidth={1} color="white" onClick={() => {deleteFavourite(user, setLoading, productId, setIsLikeState, navigate, setPathBeforeLogin)}} />
                        )
                    }
                </div>
                <div className="background-cart">
                    <ShoppingCart size={20} strokeWidth={1} color="white" />
                </div>
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

export default ProductionCard