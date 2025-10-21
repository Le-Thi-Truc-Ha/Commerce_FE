import { Col, Input, Modal, Rate, Row } from "antd";
import { FileImage, FileVideo, Star } from "lucide-react";
import type { JSX } from "react";
import type { FeedbackModalProps } from "../../../interfaces/customerInterface";

const FeedbackModal = ({openModal, setOpenModal}: FeedbackModalProps): JSX.Element => {
    const {TextArea} = Input;
    return(
        <>
            <Modal
                className="feedback-modal"
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đánh giá sản phẩm</span>}
                closable={true}
                open={openModal}
                onOk={() => {setOpenModal(false)}}
                onCancel={() => {setOpenModal(false)}}
                okText="Gửi"
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row style={{padding: "20px 0px"}}>
                    <Col span={24} style={{display: "flex", justifyContent: "center", paddingBottom: "20px"}}>
                        <Rate
                            defaultValue={5}
                            character={<Star stroke="none" fill="currentColor" size={30} />}
                            className="custom-rate"
                        />
                    </Col>
                    <Col span={24} style={{paddingTop: "20pxs"}}>
                        <TextArea className="input-ant" placeholder="Nội dung đánh giá" autoSize={{minRows: 6}} />
                    </Col>
                    <Col span={12} style={{paddingTop: "20px", paddingRight: "10px"}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "20px", padding: "20px 0px"}}>
                            <FileImage size={100} strokeWidth={1} style={{opacity: 0.3}} />
                            <div>Tải ảnh lên</div>
                            <div>{`(Tối đa 5 ảnh)`}</div>
                        </div>
                    </Col>
                    <Col span={12} style={{paddingTop: "20px", paddingRight: "10px"}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "20px", padding: "20px 0px"}}>
                            <FileVideo size={100} strokeWidth={1} style={{opacity: 0.3}} />
                            <div>Tải video lên</div>
                            <div>{`(Tối đa 1 video)`}</div>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default FeedbackModal;