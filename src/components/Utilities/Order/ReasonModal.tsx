import { Col, Input, Modal, Radio, Row } from "antd";
import { useContext, useState, type JSX } from "react";
import type { OrderData, ReasonModalProps } from "../../../interfaces/customerInterface";
import { messageService } from "../../../interfaces/appInterface";
import { returnProductApi } from "../../../services/customerService";
import dayjs from "dayjs";
import { UserContext } from "../../../configs/globalVariable";
import LoadingModal from "../../Other/LoadingModal";

const {TextArea} = Input;

const ReasonModal = ({open, setOpen, orderId, mode, indexOfItem, totalRecord, setTotalRecord, page, setPage, orderList, setOrderList}: ReasonModalProps): JSX.Element => {
    const statusOrder: number[] = [2, 3, 4, 1, 5];
    const {user} = useContext(UserContext);

    const returnReason: {value: string, label: string}[] = [
        {value: "Thiếu sản phẩm", label: "Thiếu sản phẩm"},
        {value: "Gửi sai sản phẩm", label: "Gửi sai sản phẩm"},
        {value: "Sản phẩm lỗi", label: "Sản phẩm lỗi"},
        {value: "Sản phẩm khác với mô tả", label: "Sản phẩm khác với mô tả"},
        {value: "Sản phẩm đã qua sử dụng", label: "Sản phẩm đã qua sử dụng"},
        {value: "Khác", label: "Khác"}
    ]

    const cancelReason: {value: string, label: string}[] = [
        {value: "Thay đổi thông tin giao hàng", label: "Thay đổi thông tin giao hàng"},
        {value: "Thay đổi phương thức thanh toán", label: "Thay đổi phương thức thanh toán"},
        {value: "Thay đổi số lượng sản phẩm", label: "Thay đổi số lượng sản phẩm"},
        {value: "Thay đổi phân loại", label: "Thay đổi phân loại"},
        {value: "Thay đổi mã giảm giá", label: "Thay đổi mã giảm giá"},
        {value: "Thêm ghi chú cho đơn hàng", label: "Thêm ghi chú cho đơn hàng"},
        {value: "Không còn nhu cầu đật hàng", label: "Không còn nhu cầu đật hàng"},
        {value: "Khác", label: "Khác"}
    ]

    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [reasonSelect, setReasonSelect] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");
    
    const returnProduct = async () => {
        setModalLoading(true);
        try {
            const take = totalRecord[indexOfItem - 1] == orderList[indexOfItem - 1].length ? -1 : page[indexOfItem - 1];
            const status = [statusOrder[indexOfItem - 1]]
            if (status[0] == 4) {
                status.push(6);
            }
            let reason = reasonSelect;
            if (reason == "Khác") {
                reason = otherReason
            }
            const productId: number[] = [];
            const productVariantId: number[] = [];
            const quantity: number[] = [];
            for (const item of orderList[indexOfItem - 1]) {
                if (item.id == orderId) {
                    productId.push(...item.productId)
                    productVariantId.push(...item.productVariantId)
                    quantity.push(...item.quantity);
                }
            }
            const result = await returnProductApi(orderId, take, dayjs().toISOString(), user.accountId, status, reason, mode, productId, productVariantId, quantity);
            if (result.code == 0) {
                const changeType = result.data.map((item: any) => (
                    {
                        ...item, 
                        statusHistory: (item.statusHistory ?? []).map((itemChild: any) => (
                            {
                                id: itemChild.id,
                                status: itemChild.status ?? -1,
                                date: dayjs(itemChild.date)
                            }
                        ))
                    }
                ))
                setOrderList((prev) => (
                    prev.map((item, index) => (
                        index != indexOfItem - 1 ? 
                        (index == (mode == "return" ? 4 : 3) ? [] : item) : 
                        [...item, ...changeType].filter((itemChild) => (
                            itemChild.id != orderId
                        ))
                    )) as [OrderData[], OrderData[], OrderData[], OrderData[], OrderData[]]
                ))
                setPage((prev) => (
                    prev.map((item, index) => (
                        index == (mode == "return" ? 4 : 3) ? 1 : item
                    ))
                ))
                setTotalRecord((prev) => (
                    prev.map((item, index) => (
                        index == (mode == "return" ? 4 : 3) ? 0 : ((index == 2 || index == 0) ? item - 1 : item)
                    ))
                ))
                setReasonSelect("");
                setOtherReason("");
                setOpen(false);
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setModalLoading(false);
        }
    }

    const handleCancel = () => {
        setOpen(false);
        setReasonSelect("");
        setOtherReason("");
    }

    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>{`${mode == "return" ? "Trả hàng" : "Hủy đơn"}`}</span>}
                closable={true}
                open={open}
                onOk={() => {returnProduct()}}
                onCancel={() => {handleCancel()}}
                okText={`${mode == "return" ? "Trả hàng" : "Hủy đơn"}`}
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row style={{padding: "10px 0px"}}>
                    <Col span={24}>
                        <Radio.Group
                            style={{display: "flex", flexDirection: "column", gap: "10px"}}
                            value={reasonSelect}
                            options={mode == "return" ? returnReason : cancelReason}
                            onChange={(event) => {
                                setReasonSelect(event.target.value);
                            }}
                        />
                    </Col>
                    {
                        reasonSelect == "Khác" && (
                            <Col span={24} style={{paddingTop: "10px"}}>
                                <TextArea 
                                    className="input-ant" 
                                    placeholder="Lý do khác" 
                                    autoSize={{minRows: 6}} 
                                    value={otherReason}
                                    onChange={(event) => {
                                        setOtherReason(event.target.value);
                                    }}    
                                />
                            </Col>
                        )
                    }
                </Row>
            </Modal>
            <LoadingModal 
                open={modalLoading}
                message="Đang lưu"
            />
        </>
    )
}

export default ReasonModal;