import type { JSX } from "react";
import { Col, Row } from "antd";
import { HeartOff, ShoppingCart } from "lucide-react";

const Favourite = (): JSX.Element => {
    const favouriteList: {id: number, url: string, name: string, price: string}[] = [
        {
            id: 1,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101058/pro_hong_01_1_9e8e71e41020442bb41e8695a3d0d41c_grande_gocgch.jpg",
            name: "Áo kiểu crop phối bèo viền cổ",
            price: "495,000₫"
        },
        {
            id: 2,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760101073/pro_kem_01_1_82c6568b8f2148acb48d7488460d30b4_grande_hdkdsk.jpg",
            name: "Áo sơ mi sheer tay dài phối bèo",
            price: "444,000₫"
        },
        {
            id: 3,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760034357/pro_den_3_b5e52ae3d9e54b65bdf58a64be1dcf19_grande_fbf0qy.jpg",
            name: "Áo gile kẻ sọc thắt nơ thân trước",
            price: "213,000₫"
        },
        {
            id: 4,
            url: "https://res.cloudinary.com/dibigdhgr/image/upload/v1760031345/pro_luc_01_1_0af140c6cd3c4058b97970c80993d8c7_grande_dfmcdb.jpg",
            name: "Đầm midi form suông sát nách thắt nơ lưng",
            price: "476,000₫"
        },
        {
            id: 5,
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
                            favouriteList.map((item, index) => (
                                <Col span={5} key={index} style={{border: "1px solid rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "10px", position: "relative", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)", cursor: "pointer"}}>
                                    <div>
                                        <div style={{width: "100%", height: "200px", overflow: "hidden"}}>
                                            <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={item.url} />
                                        </div>
                                        <div style={{paddingTop: "10px", display: "flex", flexDirection: "column"}}>
                                            <div style={{textAlign: "center", paddingBottom: "20px"}}>{item.name}</div>
                                            <div style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                                                <div style={{fontWeight: "600"}}>{item.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{display: "flex", gap: "10px", position: "absolute", bottom: "10px"}}>
                                        <div style={{padding: "5px 7px", backgroundColor: "var(--color7)", borderRadius: "50%"}}>
                                            <HeartOff size={20} strokeWidth={1} color="white" />
                                        </div>
                                        <div style={{padding: "5px 7px", backgroundColor: "var(--color7)", borderRadius: "50%"}}>
                                            <ShoppingCart size={20} strokeWidth={1} color="white" />
                                        </div>
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Favourite;