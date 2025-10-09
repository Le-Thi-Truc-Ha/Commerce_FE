import { useContext, useEffect, useState, type JSX } from "react";
import { Button, Col, DatePicker, Input, Row, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import customerService from "../../../services/customerService";
import { UserContext } from "../../../configs/globalVariable";
import Loading from "../../Other/Loading";

interface UserInformation {
    name: string,
    email: string,
    dob: Dayjs | null,
    gender: string | null
}
const Information = (): JSX.Element => {
    const {user} = useContext(UserContext);
    const [edit, setEdit] = useState<boolean>(false);
    const [rawInformation, setRawInformation] = useState<UserInformation>({name: "", email: "", dob: null, gender: ""});
    const [userInformation, setUserInformation] = useState<UserInformation>({name: "", email: "", dob: null, gender: ""});
    const [hasValidate, setHasValidate] = useState<boolean>(false)
    const [getInformationLoading, setGetInformationLoading] = useState<boolean>(false);
    const [saveInformationLoading, setSaveInformationLoading] = useState<boolean>(false);

    useEffect(() => {
        getAccountInformation()
    }, [])

    const getAccountInformation = async () => {
        setGetInformationLoading(true);
        try {
            const result: BackendResponse = await customerService.getAccountInformationApi(user.accountId);
            if (result.code == 0) {
                const account = result.data;
                const dob = account.dob?.isValid ? dayjs(account.dob) : null;
                setRawInformation({name: account.name, email: account.email, dob: dob, gender: account.gender})
                setUserInformation({name: account.name, email: account.email, dob: dob, gender: account.gender})
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetInformationLoading(false);
        }
    }

    const checkChange = (): boolean => {
        if (rawInformation.name != userInformation.name) {
            return true;
        }
        if (rawInformation.dob != userInformation.dob) {
            return true;
        }
        if (rawInformation.gender != userInformation.gender) {
            return true;
        }
        return false;
    }

    const saveInformation = async () => {
        if (userInformation.name != "") {
            if (checkChange()) {
                setSaveInformationLoading(true);
                try {
                    e.log("co");
                    const result: BackendResponse = await customerService.saveInformationApi(user.accountId, userInformation.name, userInformation.email, userInformation.dob?.toISOString() ?? null, userInformation.gender);
                    if (result.code == 0) {
                        messageService.success(result.message);
                        setEdit(false);
                        setRawInformation(userInformation);
                    } else {
                        messageService.error(result.message);
                    }
                } catch(e) {
                    console.log(e);
                    messageService.error("Xảy ra lỗi ở server");
                } finally {
                    setSaveInformationLoading(false);
                }
            } else {
                messageService.success("Lưu thông tin thành công");
                setEdit(false);
            }
        } else {
            setHasValidate(true);
            messageService.error("Nhập đầy đủ thông tin bắt buộc")
        }
    }

    const cancelSaveInformation = () => {
        setUserInformation(rawInformation);
        setEdit(false);
        setHasValidate(false);
    }

    return(
        <>
            <Row className="information-container" gutter={[30, 40]}>
                <Col span={24}>
                    <Row gutter={[30, 0]} align="middle" justify="center">
                        <Col span={10} style={{display: "flex", justifyContent: "end"}}>
                            <label htmlFor="name">Tên:</label>
                        </Col>
                        <Col span={14} style={{display: "flex", justifyContent: "start"}}>
                            <Input
                                id="name"
                                className="input-ant"
                                style={{width: "40%", borderRadius: "20px"}}
                                disabled={!edit}
                                status={`${hasValidate ? "error" : ""}`}
                                placeholder="Nhập họ tên"
                                value={userInformation.name}
                                onChange={(event) => {
                                    setUserInformation({...userInformation, name: event.target.value})
                                    setHasValidate(false);
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[30, 0]} align="middle" justify="center">
                        <Col span={10} style={{display: "flex", justifyContent: "end"}}>
                            <label htmlFor="email">Email:</label>
                        </Col>
                        <Col span={14} style={{display: "flex", justifyContent: "start"}}>
                            <Input
                                id="email"
                                className="input-ant"
                                style={{width: "60%", borderRadius: "20px"}}
                                disabled
                                placeholder="Nhập email"
                                value={userInformation.email}
                                onChange={(event) => {
                                    setUserInformation({...userInformation, email: event.target.value})
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[30, 0]} align="middle" justify="center">
                        <Col span={10} style={{display: "flex", justifyContent: "end"}}>
                            <label htmlFor="dob">Ngày sinh:</label>
                        </Col>
                        <Col span={14} style={{display: "flex", justifyContent: "start"}}>
                            <DatePicker
                                id="dob"
                                style={{width: "40%", borderRadius: "20px", height: "34.74px"}}
                                disabled={!edit}
                                format="DD/MM/YYYY"
                                size="large"
                                placeholder="Chọn ngày sinh"
                                value={userInformation.dob}
                                onChange={(date, dateString) => {
                                    if (typeof dateString == "string") {
                                        setUserInformation({...userInformation, dob: date})
                                    } else {
                                        messageService.error("Xảy ra lỗi khi chọn ngày");
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row gutter={[30, 0]} align="middle" justify="center">
                        <Col span={10} style={{display: "flex", justifyContent: "end"}}>
                            <label htmlFor="gender">Giới tính:</label>
                        </Col>
                        <Col span={14} style={{display: "flex", justifyContent: "start"}}>
                            <Select 
                                id="gender"
                                style={{width: "30%", borderRadius: "20px", height: "34.74px"}}
                                disabled={!edit}
                                placeholder="Chọn giới tính"
                                options={
                                    [
                                        {label: "Nam", value: "Nam"},
                                        {label: "Nữ", value: "Nữ"}
                                    ]
                                }
                                value={userInformation.gender == "" ? null : userInformation.gender}
                                onChange={(value) => {
                                    setUserInformation({...userInformation, gender: value})
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={16}>
                    <div></div>
                </Col>
                <Col span={6} style={{display: "flex", justifyContent: "start", gap: "20px"}}>
                    {
                        edit && (
                            <Button
                                variant="outlined"
                                size="large"
                                color="primary"
                                onClick={() => {cancelSaveInformation()}}
                            >
                                Hủy
                            </Button>
                        )
                    }
                    <Button
                        variant="solid"
                        color="primary"
                        size="large"
                        onClick={() => {
                            if (edit) {
                                saveInformation();
                            } else {
                                setEdit(true);
                            }
                        }}
                    >
                        {`${edit ? "Lưu" : "Chỉnh sửa"}`}
                    </Button>
                </Col>
            </Row>
            {
                (getInformationLoading || saveInformationLoading) && (
                    <Loading />
                )
            }
        </>
    )
}

export default Information;