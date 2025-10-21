import { useContext, useEffect, useState, type JSX } from "react";
import { Button, Checkbox, Col, ConfigProvider, Divider, Row, Skeleton } from "antd";
import CreateAddressModal from "./CreateAddressModal";
import { UserContext } from "../../../configs/globalVariable";
import { messageService, type BackendResponse } from "../../../interfaces/appInterface";
import Loading from "../../Other/Loading";
import * as customerService from "../../../services/customerService";
import type { AddressInformation } from "../../../interfaces/customerInterface";
import { ArchiveX } from "lucide-react";

const Address = (): JSX.Element => {
    const {user} = useContext(UserContext);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [addressList, setAddressList] = useState<AddressInformation[]>([]);
    const [getAllAddressLoading, setGetAllAddressLoading] = useState<boolean>(false);
    const [addressDefault, setAddressDefault] = useState<number>(-1);
    const [addressSelect, setAddressSelect] = useState<boolean[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [mode, setMode] = useState<string>("abcd")
    const [deleteAddressLoading, setDeleteAddressLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllAddress()
    }, []);

    const getAllAddress = async () => {
        setGetAllAddressLoading(true);
        try {
            const result: BackendResponse = await customerService.getAllAddressApi(user.accountId);
            if (result.code == 0) {
                const rawData = result.data.address.sort((a: any, b: any) => (a.id - b.id));
                setAddressList(rawData.map((item: {id: number, name: string, phoneNumber: string, address: string}) => (
                    {
                        id: item.id,
                        name: item.name,
                        phone: item.phoneNumber,
                        address: item.address
                    }
                )))
                setAddressDefault(result.data.addressDefault);
                setAddressSelect(Array(rawData.length).fill(false));
            } else {
                messageService.error(result.message);
                setAddressDefault(-1);
                setAddressList([]);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetAllAddressLoading(false);
        }
    }

    const deleteAddress = async () => {
        setDeleteAddressLoading(true);
        try {
            const idDelete = addressSelect.map((item, index) => (item && addressList[index].id)).filter((item) => (item != false));
            const result = await customerService.deleteAddressApi(user.accountId, idDelete);
            if (result.code == 0) {
                messageService.success(result.message);
                setAddressSelect(Array(addressList.length - idDelete.length).fill(false));
                setAddressList(prev => prev.filter((item) => (!idDelete.includes(item.id))));
                setSelectAll(false);
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setDeleteAddressLoading(false);
        }
    }

    return getAllAddressLoading ? (
        <Skeleton active paragraph={{rows: 10}} />
    ) :(
        <>
            <Row className="address-container" gutter={[0, 30]}>
                <Col span={24}>
                    <Row gutter={[30, 25]}>
                        {
                            addressList.length > 0 && (
                                <Col span={24}>
                                    <Checkbox 
                                        checked={selectAll} 
                                        onChange={(event) => {
                                            setSelectAll(event.target.checked)
                                            if (event.target.checked) {
                                                setAddressSelect(Array(addressList.length).fill(true));
                                            } else {
                                                setAddressSelect(Array(addressList.length).fill(false));
                                            }
                                        }} 
                                    >
                                        <div style={{paddingLeft: "22px"}}>Chọn tất cả</div>
                                    </Checkbox>
                                </Col>
                            )
                        }
                        {
                            addressList.map((item, index) => (
                                <Col 
                                    span={12} 
                                    key={index} 
                                    style={{cursor: "pointer"}} 
                                >
                                    <Row style={{display: "flex", alignItems: "center"}}>
                                        <Col span={2}>
                                            <Checkbox 
                                                checked={addressSelect[index]} 
                                                onChange={(event) => {
                                                    setAddressSelect(addressSelect.map((itemNew, indexNew) => (
                                                        indexNew == index ? event.target.checked : itemNew
                                                    )))
                                                }} 
                                            />
                                        </Col>
                                        <Col 
                                            span={22} 
                                            onClick={() => {
                                                setMode(`${item.id}`);
                                                setOpenCreateModal(true);
                                            }}
                                        >
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
                </Col>
                <Col span={24} style={{display: "flex", justifyContent: "center", position: "relative"}}>
                    {
                        addressSelect.includes(true) && (
                            <Button
                                variant="solid"
                                color="danger"
                                size="large"
                                style={{marginRight: "20px"}}
                                onClick={() => {deleteAddress()}}
                            >
                                Xóa
                            </Button>
                        )
                    }
                    <Button
                        style={{zIndex: 2, boxShadow: `${addressList.length == 0 ? "0 0 10px 2px rgba(0, 0, 0, 0.3)" : ""}`}}
                        variant="solid"
                        color="primary"
                        size="large"
                        disabled={addressList.length >= 10 ? true : false}
                        onClick={() => {
                            setOpenCreateModal(true);
                            setMode("create")
                        }}
                    >
                        Thêm địa chỉ
                    </Button>
                    {
                        addressList.length == 0 && (
                            <div style={{position: "absolute", top: "0px", zIndex: 1, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <div style={{width: "300px", height: "300px", overflow: "hidden"}}>
                                    <img style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "blur(3px)"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1760129523/no-data_q4r0yj.png" />
                                </div>
                                <div style={{color: "rgba(0, 0, 0, 0.6)", fontSize: "25px"}}>Không có dữ liệu</div>
                            </div>
                        )
                    }
                </Col>
            </Row>
            <CreateAddressModal 
                openModal={openCreateModal}
                setOpenModal={setOpenCreateModal}
                addressList={addressList}
                setAddressList={setAddressList}
                mode={mode}
                setMode={setMode}
                setAddressDefault={setAddressDefault}
            />
            {
                (getAllAddressLoading || deleteAddressLoading) && (
                    <Loading />
                )
            }
        </>
    )
}

export default Address;