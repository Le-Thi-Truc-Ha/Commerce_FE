import { Col, Modal, Row } from "antd";
import type { JSX } from "react";
import type { ConfirmDeleteModalProps } from "../../../interfaces/appInterface";

const ConfirmDeleteModal = ({open, title, okText, content, handleOk, handleCancel}: ConfirmDeleteModalProps): JSX.Element => {
    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>{title}</span>}
                closable={true}
                open={open}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText={okText}
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row style={{padding: "20px 0px"}}>
                    <Col>
                        <div>{content}</div>
                    </Col>
                </Row>
                
            </Modal>
        </>
    )
}

export default ConfirmDeleteModal;