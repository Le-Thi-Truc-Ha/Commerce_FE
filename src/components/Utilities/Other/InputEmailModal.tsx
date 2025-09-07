import { Col, Input, Modal, Row } from "antd";
import { useState, type JSX } from "react";
import { messageService, type BackendResponse, type InputEmailModalProps } from "../../../interfaces/appInterface";
import appService from "../../../services/appService";
import Loading from "../../Other/Loading";
import InputOtpModal from "./InputOtpModal";

const InputEmailModal = ({openEmail, setOpenEmail}: InputEmailModalProps): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [validate, setValidate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openOtp, setOpenOtp] = useState<boolean>(false);
    const [expiryOtp, setExpiryOtp] = useState<number>(0);

    const handleOk = async (email: string, isLoading: boolean) => {
        if (email.length != 0) {
            setIsLoading(isLoading);
            try {
                const result: BackendResponse = await appService.checkEmailApi(email);
                if (result.code == 0 || result.code == 2) {
                    handleCancel();
                    setOpenOtp(true);
                    setExpiryOtp(result.data);
                    if (result.code == 2) {
                        messageService.success(result.message);
                    }
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setIsLoading(false);
            }
        } else {
            setValidate(true);
            messageService.error("Nhập email đã đăng ký");
        }
    }

    const handleCancel = () => {
        setOpenEmail(false);
        setEmail("");
        setValidate(false);
    }

    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đặt Lại Mật Khẩu</span>}
                closable={true}
                open={openEmail}
                onOk={() => {handleOk(email, true)}}
                onCancel={() => {handleCancel()}}
                okText="Gửi mã xác thực"
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row className="py-3">
                    <Col span={24}>
                        <Row align="middle">
                            <Col style={{width: "fit-content"}}>
                                <label htmlFor="email" className="pe-3">Nhập email:</label>
                            </Col>
                            <Col flex="1">
                                <Input
                                    id="email"
                                    className="input-ant"
                                    type="text"
                                    status={`${validate ? "error" : ""}`}
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setValidate(false);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key == "Enter") {
                                            handleOk(email, true);
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
            <InputOtpModal 
                openOtp={openOtp}
                email={"n22dccn123@student.ptithcm.edu.vn"}
                expiryOtp={expiryOtp}
                setOpenOtp={setOpenOtp}
                setExpiryOtp={setExpiryOtp}
                sendOtp={handleOk}
            />
            {
                isLoading && (
                    <Loading />
                )
            }
        </>
    );
};

export default InputEmailModal;