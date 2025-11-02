import { useEffect, useState, type JSX } from "react";
import type { VoucherModalProps } from "../../../interfaces/customerInterface";
import { Col, Modal, Radio, Row } from "antd";
import { X } from "lucide-react";

const VoucherModal = ({open, setOpen, totalPrice, shippingFee, totalPriceProductType3, setShipDiscount, setProductDiscount, shipVoucherList, productVoucherList, setProductVoucherSelect, setShipVoucherSelect, productVoucherSelect, shipVoucherSelect}: VoucherModalProps): JSX.Element => {
    const [productType, setProductType] = useState<number>(0);
    const [productPercent, setProductPercent] = useState<number>(0);
    const [shipPercent, setShipPercent] = useState<number>(0);
    
    useEffect(() => {
        calculateDiscount()
    }, [shippingFee]);

    const calculateDiscount = () => {
        if (productVoucherSelect != -1) {
            if (productType == 1) {
                setProductDiscount(Math.round(((totalPrice * productPercent) / 100) / 1000) * 1000)
            } else {
                setProductDiscount(Math.round(((totalPriceProductType3 * productPercent) / 100) / 1000) * 1000)
            }
        }
        if (shipVoucherSelect != -1) {
            setShipDiscount(Math.round(((shippingFee * shipPercent) / 100) / 1000) * 1000)
        }
        setOpen(false);
    }

    return(
        <>
            <Modal
                title={null}
                footer={null}
                closable={false}
                centered={true}
                maskClosable={false}
                open={open}
                width={"600px"}
            >
                <Row style={{maxHeight: "600px", overflowY: "auto", margin: "-20px -24px -20px -24px", paddingBottom: "5px"}}>
                    {
                        shipVoucherList.length > 0 && (
                            <Col span={24} style={{padding: "20px 20px 10px 24px"}}>
                                <Row>
                                    <Col span={24}>
                                        <div style={{fontSize: "20px", fontFamily: "Prata"}}>Mã giảm giá phí vận chuyển</div>
                                        <div>Có thể chọn 1 mã giảm giá</div>
                                    </Col>
                                    {
                                        shipVoucherList.map((item, index) => (
                                            <Col key={index} span={24}>
                                                {
                                                    item.type == 2 && (
                                                        <div style={{padding: "15px 0px"}}>
                                                            <Row 
                                                                onClick={() => {
                                                                    setShipVoucherSelect(item.id);
                                                                    setShipPercent(item.discountPercent)
                                                                }}
                                                                style={{cursor: "pointer", boxShadow: "10px 10px 10px 2px rgba(0, 0, 0, 0.2)", borderRadius: "10px", border: "1px solid rgba(0, 0, 0, 0.1)"}}
                                                            >
                                                                <Col span={5} style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--color1)", borderRadius: "10px 0px 0px 10px"}}>
                                                                    <div style={{width: "80%", height: "120px", overflow: "hidden"}}>
                                                                        <img style={{width: "100%", height: "90%", objectFit: "contain"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761753226/delivery-truck_im5qzy.png" />
                                                                    </div>
                                                                </Col>
                                                                <Col span={17} style={{padding: "10px 5px 10px 15px"}}>
                                                                    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                                                                        <div>{item.name}</div>
                                                                        <div>{`Đơn tối thiểu ${item.condition.toLocaleString("en-US")}đ`}</div>
                                                                        <div>{`Ngày hết hạn: ${item.endDate.format("DD/MM/YYYY")}`}</div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={2}>
                                                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                                                                        <Radio 
                                                                            checked={shipVoucherSelect == item.id}
                                                                            onChange={() => {
                                                                                setShipVoucherSelect(item.id);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                }
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Col>
                        )
                    }
                    {
                        productVoucherList.length > 0 && (
                            <Col span={24} style={{padding: "20px 20px 20px 24px"}}>
                                <Row>
                                    <Col span={24}>
                                        <div style={{fontSize: "20px", fontFamily: "Prata"}}>Mã giảm giá sản phẩm</div>
                                        <div>Có thể chọn 1 mã giảm giá</div>
                                    </Col>
                                    {
                                        productVoucherList.map((item, index) => (
                                            <Col key={index} span={24}>
                                                {
                                                    (item.type == 3 || item.type == 1) && (
                                                        <div style={{padding: "15px 0px"}}>
                                                            <Row 
                                                                onClick={() => {
                                                                    console.log(item.id);
                                                                    setProductVoucherSelect(item.id);
                                                                    setProductType(item.type);
                                                                    setProductPercent(item.discountPercent);
                                                                }}
                                                                style={{cursor: "pointer", boxShadow: "10px 10px 10px 2px rgba(0, 0, 0, 0.2)", borderRadius: "10px", border: "1px solid rgba(0, 0, 0, 0.1)", alignItems: "stretch"}}
                                                            >
                                                                <Col span={5} style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--color1)", borderRadius: "10px 0px 0px 10px"}}>
                                                                    <div style={{width: "80%", height: "120px", overflow: "hidden"}}>
                                                                        <img style={{width: "100%", height: "90%", objectFit: "contain"}} src={`${ item.type == 1 ? "https://res.cloudinary.com/dibigdhgr/image/upload/v1761753226/bill_plqkvf.png" : "https://res.cloudinary.com/dibigdhgr/image/upload/v1761753226/tshirt_n2iaht.png"}`} />
                                                                    </div>
                                                                </Col>
                                                                <Col span={17} style={{padding: "10px 5px 10px 15px"}}>
                                                                    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                                                                        <div>{item.name}</div>
                                                                        <div>{`Đơn tối thiểu ${item.condition.toLocaleString("en-US")}đ`}</div>
                                                                        <div>{`Ngày hết hạn: ${item.endDate.format("DD/MM/YYYY")}`}</div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={2}>
                                                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                                                                        <Radio 
                                                                            checked={productVoucherSelect == item.id}
                                                                            onChange={() => {
                                                                                setProductVoucherSelect(item.id);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                }
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Col>
                        )
                    }
                    {
                        productVoucherList.length + shipVoucherList.length == 0 && (
                            <Col span={24} style={{padding: "20px 0px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <div style={{width: "80%", height: "300px", overflow: "hidden"}}>
                                    <img style={{width: "100%", height: "100%", objectFit: "contain", opacity: 0.6}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761894483/coupon_zd1kgi.png" />
                                </div>
                                <div style={{fontSize: "20px"}}>Không có voucher</div>
                            </Col>
                        )
                    }
                </Row>
                <Row style={{position: "absolute", top: "5px", right: "10px"}}>
                    <Col span={24} style={{display: "flex", justifyContent: "end", gap: "10px", paddingRight: "10px"}}>
                        <X size={30} strokeWidth={1} onClick={() => {calculateDiscount()}} style={{cursor: "pointer"}} />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default VoucherModal;