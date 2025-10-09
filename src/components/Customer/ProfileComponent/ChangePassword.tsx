import { useContext, useState, type JSX } from "react";
import { Button, Col, Input, Row } from "antd";
import { Eye, EyeOff } from "lucide-react";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import Loading from "../../Other/Loading";
import customerService from "../../../services/customerService";
import { UserContext } from "../../../configs/globalVariable";

const ChangePassword = (): JSX.Element => {
    const {user} = useContext(UserContext);
    const [show, setShow] = useState<boolean[]>([false, false, false]);
    const [password, setPassword] = useState<string[]>(["", "", ""]);
    const [hasValidate, setHasValidate] = useState<boolean[]>([false, false, false]);
    const [label, setLabel] = useState<string[]>(["Mật khẩu cũ", "Mật khẩu mới", "Xác nhận mật khẩu mới"]);
    const [savePasswordLoading, setSavePasswordLoading] = useState<boolean>(false);

    const checkValidate = (): boolean => {
        const newArray = [...hasValidate];
        password.map((item, index) => {
            if (item.length < 8) {
                newArray[index] = true;
            }
        })
        setHasValidate(newArray);
        for (let i = 0; i < newArray.length; i++) {
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
    const savePassword = async () => {
        if (!checkValidate()) {
            setSavePasswordLoading(true);
            try {
                const result: BackendResponse = await customerService.savePasswordApi(user.accountId, password[0], password[1])
                if (result.code == 0) {
                    messageService.success(result.message);
                    setPassword(["", "", ""]);
                    setShow([false, false, false]);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setSavePasswordLoading(false);
            }
        }
    }

    return(
        <>
            <Row className="change-password-container" align="middle" justify="center" gutter={[0, 30]}>
                {
                    password.map((item, index) => (
                        <Col span={24} key={index} style={{display: "flex", justifyContent: "center"}}>
                            <div style={{position: "relative"}}>
                                <Input 
                                    placeholder={label[index]}
                                    className="input-ant"
                                    style={{width: "400px", paddingRight: "45px"}}
                                    type={`${show[index] ? "text" : "password"}`}
                                    status={`${hasValidate[index] ? "error" : ""}`}
                                    value={item}
                                    onChange={(event) => {
                                        setPassword(password.map((itemNew, indexNew) => (
                                            indexNew == index ? event.target.value : itemNew
                                        )))
                                        setHasValidate(hasValidate.map((itemNew, indexNew) => (
                                            indexNew == index ? false : itemNew
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
                <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                    <Button
                        variant="solid"
                        color="primary"
                        size="large"
                        onClick={() => {
                            savePassword()
                        }}
                    >
                        Lưu
                    </Button>
                </Col>
            </Row>
            {
                savePasswordLoading && (
                    <Loading />
                )
            }
        </>
    )
}

export default ChangePassword;