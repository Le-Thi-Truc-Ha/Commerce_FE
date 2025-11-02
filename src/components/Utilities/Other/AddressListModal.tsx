import { Col, ConfigProvider, Divider, Modal, Row } from "antd";
import { useContext, useEffect, useState, type JSX } from "react";
import type { AddressInformation, AddressListModalProps } from "../../../interfaces/customerInterface";
import { UserContext } from "../../../configs/globalVariable";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import { getAllAddressApi, getDistrict, getWard } from "../../../services/customerService";
import { X } from "lucide-react";

const AddressListModal = ({open, setOpen, setName, setPhone, setDetailAddress, setRegionAddress, setLongitude, setLatitude, setRegionArray, setRegionObj, setGetAddressLoading, cityList, setDistrictList, setWardList}: AddressListModalProps): JSX.Element => {
    const {user} = useContext(UserContext);
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);
    const [addressList, setAddressList] = useState<AddressInformation[]>([]);
    const [addressDefault, setAddressDefault] = useState<number>(-1);

    useEffect(() => {
        getAllAddress()
    }, []);

    const getAllAddress = async () => {
        setSkeletonLoading(true);
        try {
            const result: BackendResponse = await getAllAddressApi(user.accountId);
            if (result.code == 0) {
                const rawData = result.data.address.sort((a: any, b: any) => (a.id - b.id));
                setAddressList(rawData.map((item: {id: number, name: string, phoneNumber: string, address: string, longitude: number, latitude: number}) => (
                    {
                        id: item.id,
                        name: item.name,
                        phone: item.phoneNumber,
                        address: item.address,
                        longitude: item.longitude,
                        latitude: item.latitude
                    }
                )))
                setAddressDefault(result.data.addressDefault);
            } else {
                messageService.error(result.message);
                setAddressDefault(-1);
                setAddressList([]);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setSkeletonLoading(false);
        }
    }

    const changeAddress = async (indexOfItem: number) => {
        try {
            const addressSelect = addressList[indexOfItem];
            setName(addressSelect.name);
            setPhone(addressSelect.phone);

            const addressArray = addressSelect.address.split("=");
            setDetailAddress(addressArray[0])
            setRegionAddress(addressArray[1])
            setLongitude(addressSelect.longitude)
            setLatitude(addressSelect.latitude)

            const regionArray = addressArray[1].split(", ")
            setRegionArray(regionArray);
            const cityCode = cityList.find((item) => (item.name == regionArray[2])).code
            const districtList: any[] = await getDistrict(cityCode, setDistrictList, setRegionObj);
            const districtCode = districtList.find((item) => (item.name == regionArray[1])).code
            const wardList: any[] = await getWard(districtCode, setWardList, setRegionObj);
            const wardCode = wardList.find((item) => (item.name == regionArray[0])).code
            setRegionObj({cityCode: cityCode, districtCode: districtCode, wardCode: wardCode})
        } catch(e) {
            console.log(e);
        }
    }

    return(
        <>
            <Modal
                title={null}
                closable={false}
                open={open}
                footer={null}
                centered={true}
                maskClosable={false}
                loading={skeletonLoading}
                width={"800px"}
            >
                <div style={{position: "relative"}}>
                    {
                        addressList.length == 0 ? (
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "-50px"}}>
                                <div style={{width: "80%", height: "400px", overflow: "hidden", opacity: 0.5}}>
                                    <img style={{width: "100%", height: "100%", objectFit: "contain"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761826838/location-map_pwm3rc.png" />
                                </div>
                                <div style={{fontSize: "20px"}}>Chưa có địa chỉ nào được lưu</div>
                            </div>
                        ) : (
                            <Row style={{maxHeight: "400px", overflowY: "auto", marginRight: "-24px"}}>
                                {
                                    addressList.map((item, index) => (
                                        <Col 
                                            span={12} 
                                            key={index} 
                                            style={{
                                                cursor: "pointer", 
                                                paddingTop: "10px", 
                                                paddingBottom: "10px", 
                                                paddingRight: `${index % 2 == 0 ? "20px" : "20px"}`, 
                                                paddingLeft: `${index % 2 == 1 ? "20px" : "0px"}`,
                                                borderTop: `${(index > 1) && "1px solid rgba(0, 0, 0, 0.3)"}`,
                                                borderRight: `${(index % 2 == 0) && "1px solid rgba(0, 0, 0, 0.3)"}`
                                            }} 
                                            onClick={() => {
                                                changeAddress(index);
                                                setOpen(false);
                                            }}
                                        >
                                            <Row style={{display: "flex", alignItems: "center"}}>
                                                <Col span={24}>
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        <div>{item.name}</div>
                                                        <ConfigProvider
                                                            theme={{
                                                                components: {
                                                                    Divider: {
                                                                        colorSplit: "rgba(0, 0, 0, 0.5)",
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                        <Divider type="vertical"/>
                                                        </ConfigProvider>
                                                        <div style={{paddingRight: "30px"}}>{item.phone}</div>
                                                        {
                                                            addressDefault == item.id && (
                                                                <div style={{color: "var(--color6)", border: "1px solid var(--color6)", padding: "2px 5px"}}>Mặc định</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div>{item.address.split("=")[0]}</div>
                                                    <div>{item.address.split("=")[1]}</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    ))
                                }
                            </Row>
                        )
                    }
                    
                    <div style={{position: "absolute", top: `${addressList.length > 0 ? "-13px" : "40px"}`, right: "-13px", cursor: "pointer"}} onClick={() => {setOpen(false)}}>
                        <X size={30} strokeWidth={1} />
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AddressListModal;