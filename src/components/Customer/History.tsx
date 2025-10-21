import type { JSX } from "react";
import { Button, Col, Row } from "antd";
import { Heart, ShoppingCart } from "lucide-react";

const History = (): JSX.Element => {
    const historyList: {id: number, url: string, name: string, price: string}[] = [
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
    return(
        <>
            <Row>
                <Col span={24} style={{minHeight: "calc(100vh - 130px)"}}>
                    <Row gutter={[0, 30]} style={{display: "flex", justifyContent: "space-between", padding: "10px 30px"}}>
                        {
                            historyList.map((item, index) => (
                                <Col span={5} key={index} style={{border: "1px solid rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "10px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <div>
                                        <div style={{width: "100%", height: "200px", overflow: "hidden"}}>
                                            <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={item.url} />
                                        </div>
                                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column"}}>
                                            <div style={{textAlign: "center", paddingBottom: "15px"}}>{item.name}</div>
                                        </div>
                                    </div>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div style={{display: "flex", gap: "10px"}}>
                                            <div style={{padding: "5px 7px", backgroundColor: "var(--color7)", borderRadius: "50%"}}>
                                                <Heart size={20} strokeWidth={1} color="white" />
                                            </div>
                                            <div style={{padding: "5px 7px", backgroundColor: "var(--color7)", borderRadius: "50%"}}>
                                                <ShoppingCart size={20} strokeWidth={1} color="white" />
                                            </div>
                                        </div>
                                        <div style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                                            <div style={{fontWeight: "600"}}>{item.price}</div>
                                        </div>
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                    <div style={{display: "flex", justifyContent: "center", paddingTop: "20px"}}>
                        <Button
                            variant="solid"
                            color="primary"
                            size="large"
                        >
                            Xem thêm
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default History;