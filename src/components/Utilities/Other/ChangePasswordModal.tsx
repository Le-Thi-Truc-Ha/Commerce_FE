import { Col, Input, Modal, Row } from "antd";
import { Eye, EyeOff } from "lucide-react";
import { useState, type Dispatch, type JSX, type SetStateAction } from "react";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import LoadingModal from "../../Other/LoadingModal";
import { savePasswordApi } from "../../../services/adminService";

interface ChangePasswordModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    accountId: number
}
const ChangePasswordModal = ({open, setOpen, accountId}: ChangePasswordModalProps): JSX.Element => {
    const label = ["Mật khẩu cũ", "Mật khẩu mới", "Xác nhận mật khẩu mới"]
    const [password, setPassword] = useState<string[]>(["", "", ""])
    const [show, setShow] = useState<boolean[]>([false, false, false])
    const [savePasswordLoading, setSavePasswordLoading] = useState<boolean>(false);
    const [hasValidate, setHasValidate] = useState<boolean[]>([false, false, false]);

    const checkValidate = (): boolean => {
        const newArray = [...hasValidate];
        password.map((item, index) => {
            if (item.length < 8) {
                newArray[index] = true;
            }
        })
        setHasValidate(newArray);
        for (let i = 1; i < newArray.length; i++) {
            if (newArray[i]) {
                messageService.error("Nhập đầy đủ thông tin và mật khẩu phải có tối thiểu 8 kí tự")
                return true;
            }
        }
        if (password[1] != password[2]) {
            messageService.error("Xác nhận lại mật khẩu mới")
            return true;
        }
        return false;
    }
    const handleOk = async () => {
        if (!checkValidate()) {
            setSavePasswordLoading(true);
            try {
                const result: BackendResponse = await savePasswordApi(accountId, password[0], password[1])
                if (result.code == 0) {
                    messageService.success(result.message);
                    setPassword(["", "", ""]);
                    setShow([false, false, false]);
                    setOpen(false);
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setSavePasswordLoading(false);
            }
        }
    }

    const handleCancel = () => {
        setPassword(["", "", ""]);
        setShow([false, false, false]);
        setOpen(false);
    }
    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đổi mật khẩu</span>}
                closable={true}
                open={open}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText={"Lưu"}
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row gutter={[0, 10]} style={{padding: "10px 0px"}}>
                    {
                        password.map((item, index) => (
                            <Col span={24} key={index} style={{display: "flex", justifyContent: "center"}}>
                                <div style={{position: "relative", width: "100%"}}>
                                    <Input 
                                        placeholder={label[index]}
                                        className="input-ant"
                                        style={{width: "100%", paddingRight: "45px", borderRadius: "15px"}}
                                        type={`${show[index] ? "text" : "password"}`}
                                        value={item}
                                        onChange={(event) => {
                                            setPassword(password.map((itemNew, indexNew) => (
                                                indexNew == index ? event.target.value : itemNew
                                            )))
                                        }}
                                    />
                                    {
                                        show[index] ? (
                                            <EyeOff 
                                                size={24} 
                                                strokeWidth={1} 
                                                style={{cursor: "pointer", position: "absolute", top: "50%", right: "10px", transform: "translateY(-52%)"}} 
                                                onClick={() => {setShow(show.map((itemNew, indexNew) => (
                                                    indexNew == index ? false : itemNew
                                                )))}}
                                            />
                                        ) : (
                                            <Eye 
                                                size={24} 
                                                strokeWidth={1} 
                                                style={{cursor: "pointer", position: "absolute", top: "50%", right: "10px", transform: "translateY(-52%)"}} 
                                                onClick={() => {setShow(show.map((itemNew, indexNew) => (
                                                    indexNew == index ? true : itemNew
                                                )))}}
                                            />
                                        )
                                    }
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </Modal>
            <LoadingModal 
                open={savePasswordLoading}
                message="Đang lưu"
            />
        </>
    )
}

export default ChangePasswordModal;