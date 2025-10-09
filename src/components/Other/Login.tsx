import { Button, Col, ConfigProvider, Divider, Input, Row } from "antd";
import { useContext, useState, type JSX, type KeyboardEvent } from "react";
import "./Login.scss";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, type UserCredential } from "firebase/auth";
import { auth, provider } from "../../configs/firebase";
import { messageService, type BackendResponse, type GoogleUser } from "../../interfaces/appInterface";
import appService from "../../services/appService";
import { UserContext, type UserType } from "../../configs/globalVariable";
import Loading from "./Loading";
import InputEmailModal from "../Utilities/Other/InputEmailModal";

export const setSessionKey = (value: string, ttl: number) => {
    const item = {
        value: value,
        expiry: Date.now() + 1000 * 60 * 60 * 24 * ttl
    };

    localStorage.setItem("sessionKey", JSON.stringify(item));
}

export const googleLogin = async (
    setLoginLoading: (value: boolean) => void, 
    loginContext: (value: UserType) => void,
    navigate: (value: string) => void,
    setSessionKey: (value: string, ttl: number) => void
) => {
    try {
        const login: UserCredential = await signInWithPopup(auth, provider);
        const user = login.user;
        const idToken = await user.getIdToken();

        const userInformation: GoogleUser = {name: user.displayName ?? "", email: user.email ?? "", idToken: idToken, uid: user.uid}
        
        setLoginLoading(true)
        const result: BackendResponse = await appService.googleLoginApi(userInformation);
        if (result.code == 0) {
            messageService.success(result.message);
            const userData: UserType = {
                isAuthenticated: true,
                accountId: result.data.id,
                roleId: result.data.roleId,
                googleLogin: result.data.googleLogin
            }
            loginContext(userData);
            navigate("/");
            setSessionKey(result.data.sessionKey, 30);
        } else {
            messageService.error(result.message);
        }
    } catch(e) {
        console.log(e);
    } finally {
        setLoginLoading(false);
    }
}

const Login = (): JSX.Element => {
    const navigate = useNavigate();
    const {loginContext} = useContext(UserContext);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [validate, setValidate] = useState<boolean[]>([false, false]);

    const [openEmail, setOpenEmail] = useState<boolean>(false);

    const checkValidate = (): boolean => {
        const newArray: boolean[] = [...validate];
        if (email.length == 0) {
            newArray[0] = true;
        }
        if (password.length == 0) {
            newArray[1] = true;
        }
        setValidate(newArray);
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i]) {
                messageService.error("Bạn phải nhập đầy đủ thông tin đăng nhập");
                return true;
            }
        }
        return false;
    }
    const normalLogin = async () => {
        if (!checkValidate()) {
            setLoginLoading(true);
            try {
                const result: BackendResponse = await appService.normalLoginApi(email, password);
                if (result.code == 0) {
                    messageService.success(result.message);
                    const userData: UserType = {
                        isAuthenticated: true,
                        accountId: result.data.id,
                        roleId: result.data.roleId,
                        googleLogin: result.data.googleLogin
                    }
                    loginContext(userData);
                    if (userData.roleId == 1) {
                        navigate("/admin/product");
                    } else {
                        navigate("/");
                    }
                    setSessionKey(result.data.sessionKey, 30);
                } else {
                    messageService.error(result.message);
            }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setLoginLoading(false);
            }
        }
    }

    return(
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            borderRadius: 20,
                            activeBorderColor: "var(--color6)",
                            activeShadow: "0 0 0 2px var(--color2)",
                            hoverBorderColor: "var(--color4)",
                        },
                        DatePicker: {
                            borderRadius: 20,
                            activeBorderColor: "var(--color6)",
                            activeShadow: "0 0 0 2px var(--color2)",
                            hoverBorderColor: "var(--color4)",
                        },
                        Select: {
                            borderRadius: 20,
                            activeBorderColor: "var(--color6)",
                            activeOutlineColor: "var(--color2)",
                            hoverBorderColor: "var(--color4)",
                            optionActiveBg: "var(--color2)",
                            controlItemBgActive: "var(--color4)"
                        },
                        Button: {
                            defaultActiveBorderColor: "var(--color7)",
                            defaultActiveColor: "var(--color7)",
                            defaultHoverBorderColor: "var(--color6)",
                            defaultHoverColor: "var(--color6)",
                            defaultShadow: "0 0 0 black",

                            colorPrimary: "var(--color5)",
                            colorPrimaryActive: "var(--color6)",
                            colorPrimaryHover: "var(--color4)",
                            primaryShadow: "0 0 0 black",
                            colorPrimaryTextHover: "var(--color4)",
                            colorPrimaryTextActive: "var(--color6)"
                        },
                        Checkbox: {
                            colorPrimary: "var(--color7)",
                            colorPrimaryHover: "var(--color6)"
                        }
                    }
                }}
            >
                <Row className="login-container" justify="center" align="middle">
                    <Col span={14} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <img style={{width: "70%"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1756143715/online-shopping_pnbyyn.png" />
                    </Col>
                    <Col span={10} style={{height: "100%"}}>
                        <Row justify="start" align="middle" style={{height: "100%"}}>
                            <Col span={20} style={{display: "flex", alignItems: "center", backgroundColor: "white", height: "75%", maxHeight: "600px", borderRadius: "15px", padding: "30px"}}>
                                <Row gutter={[0, 6]} align="middle">
                                    <Col span={24}>
                                        <div 
                                            style={{fontSize: "25px", fontWeight: "600", cursor: "pointer"}}
                                            onClick={() => {navigate("/")}}
                                        >
                                            E - COMMERCE
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <div style={{fontSize: "38px", cursor: "default"}}>Đăng Nhập</div>
                                    </Col>
                                    <Col span={24} style={{paddingTop: "20px"}}>
                                        <Row gutter={[0, 12]}>
                                            <Col span={24}>
                                                <label htmlFor="email" style={{fontSize: "18px"}}>Nhập email <span className="text-danger">*</span></label>
                                            </Col>
                                            <Col span={24}>
                                                <Input 
                                                    id="email"
                                                    className="input-ant"
                                                    type="text"
                                                    status={`${validate[0] ? "error" : ""}`}
                                                    value={email}
                                                    onChange={(event) => {
                                                        setEmail(event.target.value);
                                                        setValidate((prev) => {
                                                            return prev.map((item, index) => (index == 0 ? false : item))
                                                        })
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{paddingTop: "10px"}}>
                                        <Row gutter={[0, 12]}>
                                            <Col span={24}>
                                                <label htmlFor="password" style={{fontSize: "18px"}}>Nhập mật khẩu <span className="text-danger">*</span></label>
                                            </Col>
                                            <Col span={24} style={{position: "relative"}}>
                                                <Input 
                                                    style={{paddingRight: "45px"}}
                                                    id="password"
                                                    className="input-ant"
                                                    type={`${showPassword ? "text" : "password"}`}
                                                    status={`${validate[1] ? "error" : ""}`}
                                                    value={password}
                                                    onChange={(event) => {
                                                        setPassword(event.target.value);
                                                        setValidate((prev) => {
                                                            return prev.map((item, index) => (index == 1 ? false : item))
                                                        })
                                                    }}
                                                    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                                                        if (event.key == "Enter") {
                                                            normalLogin();
                                                        }
                                                    }}
                                                />
                                                {
                                                    showPassword ? (
                                                        <EyeOff size={24} strokeWidth={1} className="eye-icon" onClick={() => {setShowPassword(false)}} />
                                                    ) : (
                                                        <Eye size={24} strokeWidth={1} className="eye-icon" onClick={() => {setShowPassword(true)}} />
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{display: "flex", justifyContent: "end", paddingRight: "10px"}}>
                                        <div className="forgot-div" onClick={() => {setOpenEmail(true)}}>Quên mật khẩu?</div>
                                    </Col>
                                    <Col span={24} style={{paddingTop: "10px"}}>
                                        <Button
                                            size="large"
                                            color="primary"
                                            variant="solid"
                                            style={{width: "100%"}}
                                            onClick={() => {normalLogin()}}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Col>
                                    <Col span={24} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <span style={{paddingRight: "5px"}}>Bạn chưa có tài khoản?</span>
                                        <span className="create-span" onClick={() => {navigate("/create-account")}}>Tạo tài khoản</span>
                                    </Col>
                                    <Col span={24}>
                                        <Divider plain>Hoặc</Divider>
                                    </Col>
                                    <Col span={24}>
                                        <Button
                                            size="large"
                                            style={{width: "100%"}}
                                            onClick={() => {googleLogin(setLoginLoading, loginContext, navigate, setSessionKey)}}
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
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <InputEmailModal 
                            openEmail={openEmail}
                            setOpenEmail={setOpenEmail}
                        />
                    </Col>
                </Row>
                {loginLoading &&
                    <Loading />
                }
            </ConfigProvider>
        </>
    )
}

export default Login;