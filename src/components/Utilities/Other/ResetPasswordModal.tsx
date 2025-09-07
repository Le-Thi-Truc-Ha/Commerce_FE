import { useState, type JSX } from "react";
import { messageService, type ResetPasswordModalProps } from "../../../interfaces/appInterface";
import { Col, Input, Modal, Row } from "antd";
import { Eye, EyeOff } from "lucide-react";
import appService from "../../../services/appService";
import Loading from "../../Other/Loading";

const ResetPasswordModal = ({openReset, email, setOpenReset}: ResetPasswordModalProps): JSX.Element => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean[]>([false, false]);
    const [validate, setValidate] = useState<boolean[]>([false, false]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkValidate = (): boolean => {
        const newArray = [...validate];
        if (newPassword.length == 0) {
            newArray[0] = true;
        }
        if (confirmPassword.length == 0) {
            newArray[1] = true;
        }
        setValidate(newArray);
        for (const item of newArray) {
            if (item) {
                messageService.error("Bạn phải nhập đầy đủ thông tin");
                return true;
            }
        }
        if (confirmPassword != newPassword) {
            messageService.error("Mật khẩu không khớp")
            return true;
        }
        if (confirmPassword.length < 8) {
            messageService.error("Mật khẩu phải có tối thiểu 8 kí tự");
            return true;
        }
        return false;
    }

    const handleOk = async () => {
        if (!checkValidate()) {
            setIsLoading(true);
            try {
                const result = await appService.resetPasswordApi(email, newPassword);
                if (result.code == 0) {
                    messageService.success(result.message);
                    handleCancel();
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleCancel = () => {
        setOpenReset(false);
        setNewPassword("");
        setConfirmPassword("");
    }

    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đặt Lại Mật Khẩu</span>}
                closable={true}
                open={openReset}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText="Thay đổi"
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row className="py-3" gutter={[0, 16]}>
                    <Col span={24}>
                        <Row align="middle" gutter={[12, 0]}>
                            <Col style={{width: "fit-content"}}>
                                <label htmlFor="new-password">Mật khẩu mới:</label>
                            </Col>
                            <Col flex={1} style={{position: "relative"}}>
                                <Input 
                                    id="new-password"
                                    className="input-ant"
                                    type={`${showPassword[0] ? "text" : "password"}`}
                                    status={`${validate[0] ? "error" : ""}`}
                                    value={newPassword}
                                    onChange={(event) => {
                                        setNewPassword(event.target.value);
                                        setValidate((prev) => (
                                            prev.map((item, index) => (index == 0 ? false : item))
                                        ))
                                    }}
                                />
                                {
                                    showPassword[0] ? (
                                        <EyeOff 
                                            style={{position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)"}}
                                            strokeWidth={1}
                                            size={24} 
                                            onClick={() => {
                                                setShowPassword((prev) => (
                                                    prev.map((item, index) => (index == 0 ? false : item)))
                                                )}
                                            } 
                                        />
                                    ) : (
                                        <Eye 
                                            style={{position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)"}}
                                            strokeWidth={1} 
                                            size={24} 
                                            onClick={() => {
                                                setShowPassword((prev) => (
                                                    prev.map((item, index) => (index == 0 ? true : item)))
                                                )}
                                            }
                                        />
                                    )
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row align="middle" gutter={[12, 0]}>
                            <Col style={{width: "fit-content"}}>
                                <label htmlFor="confirm-password">Xác nhận mật khẩu mới:</label>
                            </Col>
                            <Col flex={1} style={{position: "relative"}}>
                                <Input 
                                    id="confirm-password"
                                    className="input-ant"
                                    type={`${showPassword[1] ? "text" : "password"}`}
                                    status={`${validate[1] ? "error" : ""}`}
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        setValidate((prev) => (
                                            prev.map((item, index) => (index == 1 ? false : item))
                                        ))
                                    }}
                                />
                                {
                                    showPassword[1] ? (
                                        <EyeOff 
                                            style={{position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)"}}
                                            strokeWidth={1}
                                            size={24} 
                                            onClick={() => {
                                                setShowPassword((prev) => (
                                                    prev.map((item, index) => (index == 1 ? false : item)))
                                                )}
                                            } 
                                        />
                                    ) : (
                                        <Eye 
                                            style={{position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)"}}
                                            strokeWidth={1} 
                                            size={24} 
                                            onClick={() => {
                                                setShowPassword((prev) => (
                                                    prev.map((item, index) => (index == 1 ? true : item)))
                                                )}
                                            }
                                        />
                                    )
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
            {
                isLoading && (
                    <Loading />
                )
            }
        </>
    );
};

export default ResetPasswordModal;