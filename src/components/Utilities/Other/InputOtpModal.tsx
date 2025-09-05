import { useEffect, useRef, useState, type ChangeEvent, type JSX, type KeyboardEvent } from "react";
import type { InputOtpModalProps } from "../../../interfaces/appInterface";
import { Col, Input, Modal, Row, type InputRef } from "antd";

const InputOtpModal = ({openOtp, email, setOpenOtp}: InputOtpModalProps): JSX.Element => {
    const inputRef = useRef<(InputRef | null)[]>([]);
    const [otp, setOtp] = useState<string[]>(Array(5).fill(""));

    useEffect(() => {
        inputRef.current[0]?.focus();
    }, [])

    const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            const newValue = [...otp];
            newValue[index] = value;
            setOtp(newValue);
            if (index < inputRef.current.length - 1) {
                inputRef.current[index + 1]?.focus();
            } else {
                console.log(newValue.join(""))
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
        }
    }

    const handleOk = async () => {
        setOpenOtp(false);
    }

    const handleCancel = () => {
        setOpenOtp(false);
    }
    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đặt Lại Mật Khẩu</span>}
                closable={true}
                open={openOtp}
                onCancel={() => {handleCancel()}}
                centered={true}
                footer={null}
                maskClosable={false}
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
                                    maxLength={1}
                                    value={otp[index]}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {handleChange(event, index)}}
                                    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {handleKeyDown(event, index)}}
                                />
                            ))
                        }
                    </Col>
                    <Col span={24} style={{display: "flex", justifyContent: "center", paddingTop: "15px"}}>
                        <div>Không nhận được mã? <span className="text-primary" style={{cursor: "pointer"}}>Gửi lại</span></div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default InputOtpModal;