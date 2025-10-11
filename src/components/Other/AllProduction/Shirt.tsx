import { Button, Col, Row } from "antd";
import type { JSX } from "react";
import "./AllProduction.scss";
import ProductionCard from "../../Utilities/ProductionCard/ProductionCard";

const Shirt = (): JSX.Element => {
    const nameProduction: string[] = [
        "Áo khoác ren thun phối bèo đính nơ", "Áo khoác ren lớp nắp túi",
        "Áo kiểu crop phối bèo viền cổ", "Áo blazer dáng crop tay ngắn cài nút",
        "Áo sát nách cổ bèo phối ren dây kéo sau", "Áo khoác thun tay dài phối bèo cột dây",
        "Áo ngắn tay xuyên thấu thêu họa tiết", "Áo sơ mi dài tay lai rút",
        "Áo sát nách cổ tim nhún eo rút dây vai", "Áo sơ mi sheer tay dài phối bèo",
        "Áo kiểu babydoll họa tiết cổ vuông phối bèo tay phồng", "Áo tơ thêu sát nách cổ tròn phối ren đính nút gỗ"
    ]
    const priceProduction: string[] = [
        "425,000₫", "555,000₫",
        "495,000₫", "535,500₫",
        "395,000₫", "355,000₫",
        "499,500₫", "409,500₫",
        "355,000₫", "444,000₫",
        "273,000₫", "364,000₫"
    ]
    const imageProduction: string[] = [
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101056/pro_xanh_duong_01_1_0988e06af8df4e2aa879eaa6b0ca9a5e_grande_kkdfpo.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101057/pro_kem_01_1_9ed6ccd6f96c4feebe79bd73d80eef16_grande_jvn1p0.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101058/pro_hong_01_1_9e8e71e41020442bb41e8695a3d0d41c_grande_gocgch.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101060/pro_den_c29ad3a22ed44eed88beb36dfa0ebd60_grande_xdrv3l.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101061/pro_den_1_ab9339c762134ec3926d86faaa116493_grande_gtnbcn.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101065/pro_kem_01_1_83429c566de34e74a7acc0fd2725ce2e_grande_un2j9c.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101064/pro_kem_01_1_fd7df983a5574843bc15cbc9ebf96fb7_grande_qkap9y.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101068/pro_xanh_duong_01_1_27713c9c02b141fca35822c0bbcdc6e9_grande_almiep.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101067/pro_nau_01_1_0af231303c6241f3b2883f7d2cc82e9d_grande_wijrbs.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101073/pro_kem_01_1_82c6568b8f2148acb48d7488460d30b4_grande_hdkdsk.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101071/pro_hoa_01_1_f3dd533b64f74cbb84f6f0a7bb94b0da_grande_drn4rw.jpg",
        "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101075/pro_hong_01_2_91fa9ebd5e7448e3a11f151f19b9e8ef_grande_ccn0f6.jpg"
    ]
    return(
        <>
            <Row className="all-product-container">
                <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                    <div style={{width: "94%"}}>
                        <Row gutter={[0, 50]}>
                            {
                                nameProduction.map((item, index) => (
                                    <ProductionCard key={index} productId={index} url={imageProduction[index]} name={item} price={priceProduction[index]} />
                                ))
                            }
                        </Row>
                    </div>
                </Col>
                <Col span={24} style={{display: "flex", justifyContent: "center", padding: "40px 0px 0px"}}>
                    <Button
                        variant="solid"
                        color="primary"
                        size="large"
                    >
                        Xem thêm
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default Shirt;