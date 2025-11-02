import { Col, Row } from "antd";
import { useEffect, useRef, useState, type JSX } from "react";
import "./Profile.scss";
import Information from "./Information";
import ChangePassword from "./ChangePassword";
import Address from "./Address";

const Profile = (): JSX.Element => {
    const nameItem: string[] = ["Xem thông tin", "Đổi mật khẩu", "Địa chỉ"]
    
    const refItem = useRef<(HTMLDivElement | null)[]>([]);
    const parentElement = useRef<(HTMLDivElement | null)>(null);
    const [indexOfItem, setIndexOfItem] = useState<number>(1);
    const [position, setPosition] = useState<{xLeft: number | null, width: number | null}>({xLeft: null, width: null})

    useEffect(() => {
        getPositionItem();
    }, [indexOfItem]);

    const getPositionItem = () => {
        const parentRect = parentElement.current?.getBoundingClientRect();
        const rect = refItem.current[indexOfItem - 1]?.getBoundingClientRect();
        setPosition({
            xLeft: rect && parentRect ? (rect?.left - parentRect?.left) : null,
            width: rect?.width ?? null
        })
    }

    return(
        <>
            <Row className="profile-container">
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <div>
                                <Col span={24} style={{display: "flex", justifyContent: "center", gap: "35px"}} ref={parentElement}>
                                    {
                                        nameItem.map((item, index) => (
                                            <div 
                                                key={index} 
                                                style={{fontSize: "20px", cursor: "pointer"}}
                                                ref={(element) => {refItem.current[index] = element}}
                                                onClick={() => {setIndexOfItem(index + 1)}}
                                            >
                                                {item}
                                            </div>
                                        ))
                                    }
                                </Col>
                                <Col span={24} style={{paddingTop: "8px", position: "relative"}}>
                                    <div style={{width: "100%", height: "1px", backgroundColor: "rgba(0, 0, 0, 0.2)"}}></div>
                                    <div className="item-underline" style={{width: `${position.width}px`, left: `${position.xLeft}px`}}></div>
                                </Col>
                            </div>
                        </Col>
                        <Col span={24} style={{paddingTop: "30px"}}>
                            {
                                indexOfItem == 1 && (
                                    <Information />
                                )
                            }
                            {
                                indexOfItem == 2 && (
                                    <ChangePassword />
                                )
                            }
                            {
                                indexOfItem == 3 && (
                                    <Address />
                                )
                            }
                        </Col>
                    </Row>
                </Col>
                
            </Row>
        </>
    )
}

export default Profile;