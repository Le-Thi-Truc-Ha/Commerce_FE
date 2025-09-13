import { useEffect, useRef, useState, type ChangeEvent, type JSX, type KeyboardEvent } from "react";
import { messageService, type InputOtpModalProps } from "../../../interfaces/appInterface";
import { Col, Input, Modal, Row, type InputRef } from "antd";
import Loading from "../../Other/Loading";
import appService from "../../../services/appService";
import ResetPasswordModal from "./ResetPasswordModal";
import { useNavigate } from "react-router-dom";

const InputOtpModal = ({openOtp, email, expiryOtp, verifyEmail, accountInformation, setOpenOtp, setExpiryOtp, sendOtp}: InputOtpModalProps): JSX.Element => {
    const inputRef = useRef<(InputRef | null)[]>([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
    const [timeLeft, setTimeLeft] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openReset, setOpenReset] = useState<boolean>(false);

    useEffect(() => {
        inputRef.current[0]?.focus();
    }, [])

    useEffect(() => {
        if (expiryOtp == 0) {
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = expiryOtp - now;
            setTimeLeft(diff > 0 ? diff : 0) 
            if (diff > 0) {
                setTimeLeft(diff);
            } else {
                setTimeLeft(0);
                setExpiryOtp(0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryOtp])

    const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            const newValue = [...otp];
            newValue[index] = value;
            setOtp(newValue);
            if (index < inputRef.current.length - 1) {
                inputRef.current[index + 1]?.focus();
            } else {
                setTimeout(() => {handleOk(newValue.join(""))}, 200)
            }
        } else {
            event.target.value= "";
        }
    }
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key == "Backspace") {
            const newValue = [...otp];
            newValue[index] = "";
            setOtp(newValue);
            if (index > 0) {
                inputRef.current[index - 1]?.focus();
            }
        } else if (event.code.startsWith("Digit") || event.code.startsWith("Numpad")) {
            const newValue = [...otp];
            if (newValue[index].length == 0) {
                newValue[index] = event.key;
            } else if (newValue[index].length == 1) {
                if (index < newValue.length - 1) {
                    newValue[index + 1] = event.key;
                    inputRef.current[index + 1]?.focus();
                }
            }
        }
    }

    const formatTimeLeft = (): string => {
        const totelSecond = Math.max(0, Math.floor(timeLeft / 1000));
        const minutes = Math.floor(totelSecond / 60);
        const seconds = totelSecond % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }

    const handleOk = async (otp: string) => {
        setIsLoading(true);
        try {
            if (!verifyEmail) {
                const result = await appService.checkOtpApi(email, otp);
                if (result.code == 0) {
                    setOpenReset(true);
                    handleCancel();
                } else {
                    messageService.error(result.message);
                }
            } else {
                const {email, name, phone, dob, gender, password} = accountInformation ?? {email: "", name: "", phone: "", dob: null, gender: "", password: ""};
                const result = await appService.createAccountApi(otp, email, name, phone, dob && dob.toISOString(), gender, password);
                if (result.code == 0) {
                    handleCancel();
                    navigate("/login");
                    messageService.success(result.message);
                } else {
                    messageService.error(result.message);
                }
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = () => {
        setOpenOtp(false);
        setExpiryOtp(0);
        setTimeLeft(-1);
        setOtp(Array(5).fill(""));
    }

    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>{`${verifyEmail ? "Xác thực Email" : "Đặt Lại Mật Khẩu"}`}</span>}
                closable={true}
                open={openOtp}
                onCancel={() => {handleCancel()}}
                centered={true}
                footer={null}
                maskClosable={false}
                loading={timeLeft == -1}
            >
                <Row className="py-4" align="middle" justify="center">
                    <Col span={24} style={{display: "flex", justifyContent: "center", paddingBottom: "15px"}}>
                        <div style={{textAlign: "center"}}>{`Nhập mã xác thực được gửi qua email ${email}`}</div>
                    </Col>
                    <Col span={24} style={{display: "flex", justifyContent: "center", gap: "20px"}}>
                        {
                            Array.from({length: 5}, (_, index) => (
                                <Input 
                                    style={{width: "9%", height: "40px", fontFamily: "Quicksand", fontSize: "20px", textAlign: "center"}}
                                    key={index + 10}
                                    tabIndex={index + 10}
                                    inputMode="numeric"
                                    ref={(element) => {inputRef.current[index] = element}}
                                    value={otp[index]}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {handleChange(event, index)}}
                                    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {handleKeyDown(event, index)}}
                                />
                            ))
                        }
                    </Col>
                    {
                        expiryOtp > 0 ? (
                            <Col span={24} style={{display: "flex", justifyContent: "center", paddingTop: "15px"}}>
                                <div>Mã xác thực hết hạn sau <span className="text-primary" style={{cursor: "default"}}>{formatTimeLeft()}</span></div>
                            </Col>
                        ) : (
                            <Col span={24} style={{display: "flex", justifyContent: "center", paddingTop: "15px"}}>
                                <div>
                                    Không nhận được mã? <span 
                                        className="text-primary" 
                                        style={{cursor: "pointer"}} 
                                        onClick={async () => {
                                            setOtp(Array(5).fill(""));
                                            setTimeLeft(-1);
                                            await sendOtp(email, false);
                                        }}
                                    >
                                        Gửi lại
                                    </span>
                                </div>
                            </Col>
                        )
                    }
                </Row>
            </Modal>
            <ResetPasswordModal 
                openReset={openReset}
                email={email}
                setOpenReset={setOpenReset}
            />
            {
                isLoading && (
                    <Loading />
                )
            }
        </>
    );
};

export default InputOtpModal;