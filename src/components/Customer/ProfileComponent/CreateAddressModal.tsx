import { useContext, useEffect, useState, type JSX } from "react";
import type { AddressInput, CreateAddressModalProps } from "../../../interfaces/customerInterface";
import { Checkbox, Col, Input, Modal, Row, Select } from "antd";
import axios from "axios";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import * as customerService from "../../../services/customerService";
import { UserContext } from "../../../configs/globalVariable";
import Loading from "../../Other/Loading";

const CreateAddressModal = ({openModal, setOpenModal, addressList, setAddressList, mode, setMode, setAddressDefault}: CreateAddressModalProps): JSX.Element => {
    const {user} = useContext(UserContext);
    const [address, setAddress] = useState<AddressInput>({name: "", phone: "", city: null, district: null, ward: null, detail: "", isDefault: false})
    const [hasValidate, setHasValidate] = useState<boolean[]>([false, false, false, false, false, false])
    const [cityName, setCityName] = useState<any[]>([]);
    const [districtName, setDistrictName] = useState<any[]>([]);
    const [wardName, setWardName] = useState<any[]>([]);
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [getAddressLoading, setGetAddressLoading] = useState<boolean>(false);

    useEffect(() => {
        getCity()
    }, [])

    const getCity = async () => {
        try {
            const result = await axios.get("https://provinces.open-api.vn/api/p/");
            setCityName(result.data);
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi trong quá trình lấy dữ liệu")
        }
    }

    useEffect(() => {
        if (address.city && mode == "create") {
            getDistrict(address.city)
        }
    }, [address.city]);

    const getDistrict = async (cityCode: number): Promise<any> => {
        try {
            const result = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
            setDistrictName(result.data.districts);
            setAddress(prev => ({...prev, district: null, ward: null}))
            return result.data.districts;
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi trong quá trình lấy dữ liệu")
        }
    }

    useEffect(() => {
        if (address.district && mode == "create") {
            getWard(address.district)
        }
    }, [address.district]);

    const getWard = async (districtCode: number): Promise<any> => {
        try {
            const result = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWardName(result.data.wards);
            setAddress(prev => ({...prev, ward: null}))
            return result.data.wards;
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi trong quá trình lấy dữ liệu")
        }
    }

    useEffect(() => {
        if (!isNaN(Number(mode))) {
            getAddress();
        }
    }, [mode])

    const getAddress = async () => {
        setGetAddressLoading(true);
        try {
            const addressId = Number(mode);
            const result = await customerService.getAddressApi(addressId, user.accountId);
            if (result.code == 0) {
                const rawData = result.data.address;
                const name = rawData.name;
                const phone = rawData.phoneNumber;
                const detail = rawData.address.split("=")[0];
                const [ward, district, city] = rawData.address.split("=")[1].split(", ");
                const cityCode = cityName.find((item) => (item.name == city))?.code;
                const districtTmp = await getDistrict(cityCode);
                const districtCode = districtTmp.find((item: any) => (item.name == district))?.code;
                const wardTmp = await getWard(districtCode);
                const wardCode = wardTmp.find((item: any) => (item.name == ward))?.code;
                setAddress({name: name, phone: phone, city: cityCode, district: districtCode, ward: wardCode, detail: detail, isDefault: result.data.isDefault})
            } else {
                setOpenModal(false);
                messageService.error(result.message);
                setMode("abcd");
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetAddressLoading(false);
        }
    }

    const checkValidate = (): boolean => {
        const newArray = [...hasValidate];
        if (address.name == "") {
            newArray[0] = true;
        }
        if (address.phone.length != 10) {
            newArray[1] = true;
        }
        if (address.city == null) {
            newArray[2] = true;
        }
        if (address.district == null) {
            newArray[3] = true;
        }
        if (address.ward == null) {
            newArray[4] = true;
        }
        if (address.detail == "") {
            newArray[5] = true;
        }
        setHasValidate(newArray);
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i]) {
                messageService.error("Nhập đầy đủ thông tin");
                return true;
            }
        }
        return false;
    }

    const handleOk = async () => {
        if (mode == "create") {
            if (!checkValidate()) {
                setCreateLoading(true);
                try {
                    const city = cityName.find((item) => (item.code == address.city))?.name;
                    const district = districtName.find((item) => (item.code == address.district))?.name;
                    const ward = wardName.find((item) => (item.code == address.ward))?.name;
                    const region = [ward, district, city].join(", ");
                    const fullAddress = address.detail.trim() + "=" + region;
                    const result: BackendResponse = await customerService.createAddressApi(user.accountId, address.name, address.phone, fullAddress, address.isDefault);
                    if (result.code == 0) {
                        handleCancel();
                        messageService.success(result.message);
                        const newAddress = result.data.addressData;
                        setAddressList([...addressList, {
                            id: newAddress.id,
                            name: newAddress.name,
                            phone: newAddress.phoneNumber,
                            address: newAddress.address
                        }])
                        if (result.data.isDefault) {
                            setAddressDefault(newAddress.id);
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
        } else {
            if (!checkValidate()) {
                setCreateLoading(true);
                try {
                    const city = cityName.find((item) => (item.code == address.city))?.name;
                    const district = districtName.find((item) => (item.code == address.district))?.name;
                    const ward = wardName.find((item) => (item.code == address.ward))?.name;
                    const region = [ward, district, city].join(", ");
                    const fullAddress = address.detail.trim() + "=" + region;
                    const result: BackendResponse = await customerService.updateAddressApi(Number(mode), user.accountId, address.name, address.phone, fullAddress, address.isDefault);
                    if (result.code == 0) {
                        messageService.success(result.message);
                        setAddressList(addressList.map((item) => (
                            item.id == Number(mode) ? {
                                id: Number(mode),
                                name: address.name,
                                phone: address.phone,
                                address: fullAddress
                            } : item
                        )))
                        if (address.isDefault) {
                            setAddressDefault(Number(mode));
                        }
                        handleCancel();
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
    }
    const handleCancel = () => {
        setOpenModal(false);
        setHasValidate([false, false, false, false, false, false])
        setAddress({name: "", phone: "", city: null, district: null, ward: null, detail: "", isDefault: false});
        setMode("abcd");
    }
    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>{`${mode == "create" ? "Thêm Địa Chỉ" : "Sửa thông tin địa chỉ"}`}</span>}
                closable={true}
                open={openModal}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText={`${mode == "create" ? "Thêm" : "Lưu"}`}
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
                loading={getAddressLoading}
            >
                <Row style={{padding: "20px 0px"}} gutter={[0, 25]}>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <label style={{width: "fit-content"}} htmlFor="name">Tên người nhận:</label>
                        <Input
                            style={{flex: "1"}}
                            id="name"
                            className="input-ant"
                            status={`${hasValidate[0] ? "error" : ""}`}
                            value={address.name}
                            onChange={(event) => {
                                setAddress({...address, name: event.target.value});
                                setHasValidate(hasValidate.map((item, index) => (
                                    index == 0 ? false : item
                                )))
                            }}
                        />
                    </Col>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <label style={{width: "fit-content"}} htmlFor="phone">Số điện thoại:</label>
                        <Input
                            style={{flex: "1"}}
                            id="phone"
                            className="input-ant"
                            status={`${hasValidate[1] ? "error" : ""}`}
                            value={address.phone}
                            onChange={(event) => {
                                setAddress({...address, phone: event.target.value});
                                setHasValidate(hasValidate.map((item, index) => (
                                    index == 1 ? false : item
                                )))
                            }}
                        />
                    </Col>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <label style={{width: "fit-content"}} htmlFor="city">Thành phố:</label>
                        <Select 
                            id="city"
                            style={{height: "34.74px", flex: "1"}}
                            placeholder="Chọn thành phố"
                            options={
                                cityName.map((item) => (
                                    {label: item.name, value: item.code}
                                ))
                            }
                            status={`${hasValidate[2] ? "error" : ""}`}
                            value={address.city}
                            onChange={(value) => {
                                setAddress({...address, city: value})
                                setHasValidate(hasValidate.map((item, index) => (
                                    index == 2 ? false : item
                                )))
                                getDistrict(value);
                            }}
                        />
                    </Col>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <label style={{width: "fit-content"}} htmlFor="district">Quận:</label>
                        <Select 
                            id="district"
                            style={{height: "34.74px", flex: "1"}}
                            placeholder="Chọn quận"
                            options={
                                districtName.map((item) => (
                                    {label: item.name, value: item.code}
                                ))
                            }
                            status={`${hasValidate[3] ? "error" : ""}`}
                            value={address.district}
                            onChange={(value) => {
                                setAddress({...address, district: value})
                                setHasValidate(hasValidate.map((item, index) => (
                                    index == 3 ? false : item
                                )))
                                getWard(value);
                            }}
                        />
                    </Col>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <label style={{width: "fit-content"}} htmlFor="ward">Phường:</label>
                        <Select 
                            id="ward"
                            style={{height: "34.74px", flex: "1"}}
                            placeholder="Chọn phường"
                            options={
                                wardName.map((item) => (
                                    {label: item.name, value: item.code}
                                ))
                            }
                            status={`${hasValidate[4] ? "error" : ""}`}
                            value={address.ward}
                            onChange={(value) => {
                                setAddress({...address, ward: value})
                                setHasValidate(hasValidate.map((item, index) => (
                                    index == 4 ? false : item
                                )))
                            }}
                        />
                    </Col>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <label style={{width: "fit-content"}} htmlFor="detail">Chi tiết:</label>
                        <Input
                            style={{flex: "1"}}
                            id="detail"
                            className="input-ant"
                            status={`${hasValidate[5] ? "error" : ""}`}
                            value={address.detail}
                            onChange={(event) => {
                                setAddress({...address, detail: event.target.value});
                                setHasValidate(hasValidate.map((item, index) => (
                                    index == 5 ? false : item
                                )))
                            }}
                        />
                    </Col>
                    <Col span={24} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <Checkbox checked={address.isDefault} onChange={(event) => {setAddress({...address, isDefault: event.target.checked})}}>Địa chỉ mặc định</Checkbox>
                    </Col>
                </Row>
            </Modal>
            {
                (createLoading) && (
                    <Loading />
                )
            }
        </>
    )
}

export default CreateAddressModal;