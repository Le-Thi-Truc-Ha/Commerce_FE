import { Col } from "antd";
import { Heart, ShoppingCart } from "lucide-react";
import type { JSX } from "react";
import type { ProductionCardProps } from "../../../interfaces/appInterface";
import "./ProductionCard.scss";
import { useLocation, useNavigate } from "react-router-dom";

const ProductionCard = ({productId, url, name, price}: ProductionCardProps): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();

    const navigateProductionDetail = () => {
        const currentPath = location.pathname;
        navigate(`${currentPath}/${productId}`);
    }
    return(
        <>
            <Col key={productId} span={6} style={{display: "flex", justifyContent: "center", position: "relative"}} onClick={() => {navigateProductionDetail()}}>
                <div className="item-card">
                    <div style={{width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={url} />
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
                        <div style={{fontSize: "20px", textAlign: "center"}}>{name}</div>
                        <div style={{fontSize: "20px"}}>{price}</div>
                    </div>
                </div>
                <div className="background-enjoy">
                    <Heart size={22} strokeWidth={1} color="white" />
                </div>
                <div className="background-cart">
                    <ShoppingCart size={20} strokeWidth={1} color="white" />
                </div>
            </Col>
        </>
    )
}

export default ProductionCard