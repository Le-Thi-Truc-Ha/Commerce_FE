import { Button, Col, ConfigProvider, DatePicker, Divider, Input, Row, Select } from "antd";
import { useContext, useState, type JSX } from "react";
import "./CreateAccount.scss";
import dayjs, { Dayjs } from "dayjs";
import { googleLogin, setSessionKey } from "./Login";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../configs/globalVariable";
import Loading from "./Loading";
import { configProvider, messageService } from "../../interfaces/appInterface";
import { Eye, EyeOff } from "lucide-react";
import * as appService from "../../services/appService";
import InputOtpModal from "../Utilities/Other/InputOtpModal";

const CreateAccount = (): JSX.Element => {
    const navigate = useNavigate();
    const {loginContext, setCart} = useContext(UserContext);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [dob, setDob] = useState<Dayjs | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean[]>([false, false]);
    const [validate, setValidate] = useState<boolean[]>([false, false, false, false]);
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [openOtp, setOpenOtp] = useState<boolean>(false);
    const [expiryOtp, setExpiryOtp] = useState<number>(0);

    const checkValidate = (): boolean => {
        const newArray = [...validate];
        if (email.length == 0) {
            newArray[0] = true;
        }
        if (name.length == 0) {
            newArray[1] = true;
        }
        if (password.length == 0) {
            newArray[2] = true;
        }
        if (confirmPassword.length == 0) {
            newArray[3] = true;
        }
        setValidate(newArray);
        for (const item of newArray) {
            if (item) {
                messageService.error("Các thông tin có dấu * là bắt buộc");
                return true;
            }
        }
        if (password != confirmPassword) {
            messageService.error("Mật khẩu xác nhận không khớp");
            return true;
        }
        if (password.length < 8) {
            messageService.error("Mật khẩu phải có tối thiểu 8 kí tự");
            return true;
        }
        return false;
    }

    const verifyEmail = async (email: string, isLoading: boolean) => {
        if (!checkValidate()) {
            setCreateLoading(true);
            try {
                const result = await appService.verifyEmailApi(email);
                if (result.code == 0 || result.code == 2) {
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
                setCreateLoading(false);
            }
        }
    }

    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
                <Row className="create-account-container" justify="center" align="middle" style={{height: "100vh"}}>
                    <Col xs={13} md={7} style={{height: "85%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Row className="form-create">
                            <Col span={24} style={{paddingBottom: "20px"}}>
                                <div style={{textAlign: "center", fontFamily: "Prata", fontSize: "30px"}}>Đăng Ký Tài Khoản</div>
                            </Col>
                            <Col span={24}>
                                <Input 
                                    placeholder="Email *"
                                    className="input-ant"
                                    status={`${validate[0] ? "error": ""}`}
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setValidate((prev) => (
                                            prev.map((item, index) => (index == 0 ? false : item))
                                        ))
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <Input 
                                    placeholder="Họ tên *"
                                    className="input-ant"
                                    status={`${validate[1] ? "error": ""}`}
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                        setValidate((prev) => (
                                            prev.map((item, index) => (index == 1 ? false : item))
                                        ))
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <DatePicker
                                    style={{width: "100%", height: "34.74px"}}
                                    format="DD/MM/YYYY"
                                    size="large"
                                    placeholder="Ngày sinh"
                                    value={dob}
                                    onChange={(date, dateString) => {
                                        if (typeof dateString == "string") {
                                            setDob(date);
                                        } else {
                                            messageService.error("Xảy ra lỗi khi chọn ngày");
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <Select 
                                    style={{width: "100%", height: "34.74px"}}
                                    placeholder="Giới tính"
                                    options={
                                        [
                                            {label: "Nam", value: "Nam"},
                                            {label: "Nữ", value: "Nữ"}
                                        ]
                                    }
                                    value={gender}
                                    onChange={(value) => {
                                        setGender(value);
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <div style={{position: "relative"}}>
                                    <Input 
                                        style={{paddingRight: "40px"}}
                                        placeholder="Mật khẩu *"
                                        className="input-ant"
                                        type={`${showPassword[0] ? "text": "password"}`}
                                        status={`${validate[2] ? "error": ""}`}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            setValidate((prev) => (
                                                prev.map((item, index) => (index == 2 ? false : item))
                                            ))
                                        }}
                                    />
                                    {
                                        showPassword[0] ? (
                                            <EyeOff 
                                                style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)"}}
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
                                                style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)"}}
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
                                </div>
                            </Col>
                            <Col span={24}>
                                <div style={{position: "relative"}}>
                                    <Input 
                                        style={{paddingRight: "40px"}}
                                        placeholder="Xác nhận mật khẩu *"
                                        className="input-ant"
                                        type={`${showPassword[1] ? "text": "password"}`}
                                        status={`${validate[3] ? "error": ""}`}
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value);
                                            setValidate((prev) => (
                                                prev.map((item, index) => (index == 3 ? false : item))
                                            ))
                                        }}
                                    />
                                    {
                                        showPassword[1] ? (
                                            <EyeOff 
                                                style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)"}}
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
                                                style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)"}}
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
                                </div>
                            </Col>
                            <Col span={24}>
                                <Button color="primary" variant="solid" size="large" style={{width: "100%"}} onClick={() => {verifyEmail(email, false)}}>Đăng ký</Button>
                            </Col>
                            <Col span={24}>
                                <Divider size="small" plain>Hoặc</Divider>
                            </Col>
                            <Col span={24}>
                                <Button
                                    size="large"
                                    style={{width: "100%"}}
                                    onClick={() => {googleLogin(setLoginLoading, loginContext, navigate, setSessionKey, setCart)}}
                                >
                                    <svg width="24px" height="24px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
                                            <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
                                            <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
                                            <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path>
                                        </g>
                                    </svg>
                                    <div>Đăng nhập với Google</div>
                                </Button>
                            </Col>
                            <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                                <div>Đã có tài khoản? <span style={{cursor: "pointer", color: "var(--color6)"}} onClick={() => {navigate("/login")}}>Đăng nhập</span></div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <InputOtpModal 
                    openOtp={openOtp}
                    email={email}
                    expiryOtp={expiryOtp}
                    verifyEmail={true}
                    accountInformation={{email, name, dob, gender, password}}
                    setOpenOtp={setOpenOtp}
                    setExpiryOtp={setExpiryOtp}
                    sendOtp={verifyEmail}
                />
                {
                    (loginLoading || createLoading) && (
                        <Loading />
                    )
                }
            </ConfigProvider>
        </>
    )
}

export default CreateAccount;