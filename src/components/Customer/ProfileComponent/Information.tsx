import { useState, type JSX } from "react";
import "./Information.scss";
import { Col, ConfigProvider, DatePicker, Input, Row, Select } from "antd";
import type { Dayjs } from "dayjs";
import { messageService } from "../../../interfaces/appInterface";

interface UserInformation {
    name: string,
    email: string,
    dob: Dayjs | null,
    gender: string | null
}
const Information = (): JSX.Element => {
    const [edit, setEdit] = useState<boolean>(true);
    const [userInformation, setUserInformation] = useState<UserInformation>({name: "", email: "", dob: null, gender: ""});
    const [hasValidate, setHasValidate] = useState<boolean[]>([false, false])

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
                                status={`${hasValidate[0] ? "error" : ""}`}
                                placeholder="Nhập họ tên"
                                value={userInformation.name}
                                onChange={(event) => {
                                    setUserInformation({...userInformation, name: event.target.value})
                                    setHasValidate(hasValidate.map((item, index) => (
                                        index == 0 ? false : item
                                    )))
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
                                disabled={!edit}
                                status={`${hasValidate[1] ? "error" : ""}`}
                                placeholder="Nhập email"
                                value={userInformation.email}
                                onChange={(event) => {
                                    setUserInformation({...userInformation, email: event.target.value})
                                    setHasValidate(hasValidate.map((item, index) => (
                                        index == 1 ? false : item
                                    )))
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
            </Row>
        </>
    )
}

export default Information;