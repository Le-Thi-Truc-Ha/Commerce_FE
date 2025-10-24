import { Button, Checkbox, Col, ConfigProvider, Divider, Row, Skeleton } from "antd";
import { Minus, Plus, Trash } from "lucide-react";
import { useContext, useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { configProvider, messageService } from "../../interfaces/appInterface";
import { UserContext } from "../../configs/globalVariable";
import { getProductInCartApi } from "../../services/customerService";
import LoadingModal from "../Other/LoadingModal";
import type { CartProduct } from "../../interfaces/customerInterface";
import "./Cart.scss";

const Cart = (): JSX.Element => {
    const navigate = useNavigate();
    const {user, setQuantityOrder, quantityOrder} = useContext(UserContext);
    const [productList, setProductList] = useState<CartProduct[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const [quantityOrderList, setQuantityOrderList] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [itemSelect, setItemSelect] = useState<boolean[]>([]);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    useEffect(() => {
        getProductInCart()
    }, [currentPage])

    const getProductInCart = async () => {
        setGetDataLoading(true);
        try {
            const result = await getProductInCartApi(user.accountId, currentPage);
            setGetDataLoading(false);
            if (result.code == 0) {
                const product: CartProduct[] = result.data.product;
                if (currentPage == 1) {
                    setProductList(product);
                    setTotalRecord(result.data.count);
                    setQuantityOrderList(product.map((item: CartProduct) => (item.quantityOrder)))
                    setTotalPrice(product.map((item: CartProduct) => (item.discount ? item.discount * item.quantityOrder : item.price * item.quantityOrder)))
                    setItemSelect(Array(product.length).fill(false));
                } else {
                    setProductList((prev) => ([...prev, ...product]));
                    setQuantityOrderList((prev) => ([...prev, ...product.map((item: CartProduct) => (item.quantityOrder))]))
                    setTotalPrice((prev) => ([...prev, ...product.map((item: CartProduct) => (item.discount ? item.discount * item.quantityOrder : item.price * item.quantityOrder))]))
                    setItemSelect((prev) => ([...prev, ...Array(product.length).fill(false)]))
                }
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server")
        } finally {
            setGetDataLoading(false);
        }
    }
    
    const increaseQuantity = (indexOfItem: number) => {
        const itemCart = productList[indexOfItem];
        if (quantityOrderList[indexOfItem] >= itemCart.quantity) {
            messageService.error("Không đủ số lượng giao hàng")
        } else {
            setQuantityOrderList((prev) => (
                prev.map((item, index) => (index == indexOfItem ? item + 1 : item))
            ))
            setTotalPrice((prev) => (
                prev.map((item, index) => (index == indexOfItem ? (itemCart.discount ? item + itemCart.discount : item + itemCart.price) : item))
            ))
            const existItem = quantityOrder.find((item) => (item.cartId == itemCart.cartId))
            if (existItem) {
                if (existItem.quantityUpdate + 1 == itemCart.quantityOrder) {
                    setQuantityOrder((prev) => (
                        prev.filter((item) => (item.cartId != itemCart.cartId))
                    ))
                } else {
                    setQuantityOrder((prev) => (
                        prev.map((item) => (item.cartId == itemCart.cartId ? {...item, quantityUpdate: item.quantityUpdate + 1} : item))
                    ))
                }
            } else {
                setQuantityOrder((prev) => ([...prev, {cartId: itemCart.cartId, quantityUpdate: quantityOrderList[indexOfItem] + 1}]))
            }
        }
    }
    const decreaseQuantity = (indexOfItem: number) => {
        const itemCart = productList[indexOfItem];
        if (quantityOrderList[indexOfItem] <= 1) {
            messageService.error("Số lượng đặt hàng phải lớn hơn 0")
        } else {
            setQuantityOrderList((prev) => (
                prev.map((item, index) => (index == indexOfItem ? item - 1 : item))
            ))
            setTotalPrice((prev) => (
                prev.map((item, index) => (index == indexOfItem ? (itemCart.discount ? item - itemCart.discount : item - itemCart.price) : item))
            ))
            const existItem = quantityOrder.find((item) => (item.cartId == itemCart.cartId))
            if (existItem) {
                if (existItem.quantityUpdate - 1 == itemCart.quantityOrder) {
                    setQuantityOrder((prev) => (
                        prev.filter((item) => (item.cartId != itemCart.cartId))
                    ))
                } else {
                    setQuantityOrder((prev) => (
                        prev.map((item) => (item.cartId == itemCart.cartId ? {...item, quantityUpdate: item.quantityUpdate - 1} : item))
                    ))
                }
            } else {
                setQuantityOrder((prev) => ([...prev, {cartId: itemCart.cartId, quantityUpdate: quantityOrderList[indexOfItem] - 1}]))
            }
        }
    }

    const deleteCart = async (type: string) => {
        alert("me")
        // setDeleteLoading(true);
        // try {

        // } catch(e) {
        //     console.log(e);
        //     messageService.error("Xảy ra lỗi ở server")
        // } finally {
        //     setDeleteLoading(false);
        // }
    }
    return(
        <>
            <ConfigProvider theme={{components: configProvider}}>
                <Row className="cart-container" style={{padding: "30px 100px"}}>
                    <Col span={24} style={{paddingBottom: "30px"}}>
                        <div style={{fontFamily: "Prata", fontSize: "30px", textAlign: "center"}}>Giỏ hàng</div>
                    </Col>
                    {
                        (getDataLoading && currentPage == 1) ? (
                            <Skeleton active paragraph={{rows: 16}} />
                        ) : (
                            <>
                                <Col span={16} style={{display: "flex", flexDirection: "column"}}>
                                    <Row style={{width: "100%", display: "flex", alignItems: "center", paddingBottom: "20px", cursor: "default"}}>
                                        <Col span={1}>
                                            <Checkbox 
                                                disabled={productList.length == 0}
                                                style={{cursor: "pointer"}}
                                                checked={selectAll} 
                                                onChange={(event) => {
                                                    setSelectAll(event.target.checked);
                                                    if (event.target.checked) {
                                                        setItemSelect(Array(productList.length).fill(true));
                                                    } else {
                                                        setItemSelect(Array(productList.length).fill(false));
                                                    }
                                                }} 
                                            />
                                        </Col>
                                        <Col span={10}>
                                            <div style={{fontSize: "20px", fontWeight: 600}}>Thông tin sản phẩm</div>
                                        </Col>
                                        <Col span={4}>
                                            <div style={{fontSize: "20px", fontWeight: 600}}>Đơn giá</div>
                                        </Col>
                                        <Col span={5}>
                                            <div style={{fontSize: "20px", fontWeight: 600}}>Số lượng</div>
                                        </Col>
                                        <Col span={4}>
                                            <div style={{fontSize: "20px", fontWeight: 600}}>Tổng cộng</div>
                                        </Col>
                                    </Row>
                                    {
                                        productList.length == 0 ? (
                                            <>
                                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity: 0.6}}>
                                                    <div style={{width: "60%", height: "450px", overflow: "hidden"}}>
                                                        <img style={{width: "100%", height: "100%", objectFit: "contain"}} src="https://res.cloudinary.com/dibigdhgr/image/upload/v1761229712/empty-cart_awrztl.png"/>
                                                    </div>
                                                    <div style={{fontSize: "30px"}}>Chưa có sản phẩm trong giỏ hàng</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {
                                                    productList.map((item, index) => (
                                                        <Row 
                                                            key={index} 
                                                            style={{width: "100%", display: "flex", alignItems: "center", padding: "20px 0px", borderTop: "1px solid rgba(0, 0, 0, 0.4)", cursor: "pointer"}}
                                                            onClick={() => {navigate(`/all-production/${item.parentCategory}/${item.productId}`)}}
                                                        >
                                                            <Col span={1}>
                                                                <Checkbox 
                                                                    checked={itemSelect[index]} 
                                                                    onClick={(event) => {event.stopPropagation()}}
                                                                    onChange={(event) => {setItemSelect((prev) => (
                                                                        prev.map((itemChild, indexChild) => (indexChild == index ? event.target.checked : itemChild))
                                                                    ))}}
                                                                />
                                                            </Col>
                                                            <Col span={10}>
                                                                <Row style={{width: "90%"}}>
                                                                    <Col span={9} style={{width: "35%", height: "150px", overflow: "hidden", borderRadius: "10px", boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.2)"}}>
                                                                        <img style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px"}} src={item.url} />
                                                                    </Col>
                                                                    <Col span={15} style={{width: "60%", display: "flex", flexDirection: "column", alignItems: "start", gap: "10px", paddingLeft: "20px", justifyContent: "space-between"}}>
                                                                        <div style={{display: "flex", flexDirection: "column", alignItems: "start", gap: "10px"}}>
                                                                            <div>{item.name}</div>
                                                                            <div style={{border: "1px solid var(--color7)", padding: "5px 10px", borderRadius: "20px", fontSize: "14px", cursor: "pointer"}}>{item.color} / {item.size}</div>
                                                                            <div>{`Còn ${item.quantity} sản phẩm`}</div>
                                                                        </div>
                                                                        <div 
                                                                            className="delete-cart" 
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                                deleteCart("only");
                                                                            }}
                                                                        >
                                                                            Xóa
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col span={4}>
                                                                <div style={{display: "flex", justifyContent: "start", alignItems: "start", flexDirection: "column"}}>
                                                                    {
                                                                        item.discount && (
                                                                            <div className="text-danger" style={{fontSize: "20px", fontWeight: 600}}>{`${item.discount.toLocaleString("en-US")}đ`}</div>
                                                                        )
                                                                    }
                                                                    <div style={item.discount ? {textDecoration: "line-through"} : {fontSize: "20px", fontWeight: 600}}>{`${item.price.toLocaleString("en-US")}đ`}</div>
                                                                </div>
                                                            </Col>
                                                            <Col span={5} style={{display: "flex", alignItems: "center", gap: "20px", justifyContent: "start"}}>
                                                                <div style={{display: "flex", alignItems: "center", gap: "30px"}}>
                                                                    <div 
                                                                        style={{padding: "2px", border: "1px solid var(--color7)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"}} 
                                                                        onClick={(event) => {
                                                                            decreaseQuantity(index);
                                                                            event.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <Minus size={20} strokeWidth={1} color="var(--color7)" />
                                                                    </div>
                                                                    <div style={{fontSize: "20px"}}>{quantityOrderList[index]}</div>
                                                                    <div 
                                                                        style={{padding: "2px", border: "1px solid var(--color7)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"}} 
                                                                        onClick={(event) => {
                                                                            increaseQuantity(index);
                                                                            event.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <Plus size={20} strokeWidth={1} color="var(--color7)" />
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col span={4}>
                                                                <div>
                                                                    <div style={{fontSize: "20px", fontWeight: 600}}>{`${totalPrice[index].toLocaleString("en-US")}đ`}</div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }
                                                {
                                                    productList.length < totalRecord && (
                                                        <Row style={{paddingTop: "20px"}}>
                                                            <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                                                                <Button
                                                                    variant="solid"
                                                                    color="primary"
                                                                    size="large" 
                                                                    onClick={() => {setCurrentPage((prev) => (prev + 1))}}
                                                                >
                                                                    Xem thêm
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            </> 
                                        )
                                        
                                    }
                                </Col>
                                <Col span={8} style={{position: "sticky", top: "100px", alignSelf: "start", display: "flex", justifyContent: "end"}}>
                                    <div style={{width: "90%", height: "fit-content", backgroundColor: "white", padding: "20px", borderRadius: "20px", boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)"}}>
                                        <div>
                                            <div style={{fontFamily: "Prata", fontSize: "25px"}}>Đơn hàng</div>
                                            <Divider size="small" />
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <div style={{fontSize: "20px"}}>2 sản phẩm</div>
                                                <div style={{fontSize: "20px"}}>930,500₫</div>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", gap: "20px"}}>
                                            <button
                                                className="button-delete btn btn-danger"
                                                onClick={() => {deleteCart("all")}}
                                                disabled={!itemSelect.find((item) => (item == true))}
                                            >
                                                Xóa
                                            </button>
                                            <ConfigProvider
                                                theme={{
                                                    components: {
                                                        Button: {
                                                            colorBgContainerDisabled: "rgba(186, 145, 115, 0.7)",
                                                            borderColorDisabled: "rgba(186, 145, 115, 0.2)",
                                                            colorTextDisabled: "white"
                                                        }
                                                    }
                                                }}
                                            >
                                                <Button
                                                    style={{width: "50%", marginTop: "10px", transition: "all 0.3s ease-in-out", cursor: `${!itemSelect.find((item) => (item == true)) ? "default" : "pointer"}`}}
                                                    size="large"
                                                    variant="solid"
                                                    color="primary"
                                                    onClick={() => {navigate("/customer/pay")}}
                                                    disabled={!itemSelect.find((item) => (item == true))}
                                                >
                                                    Đặt hàng
                                                </Button>
                                            </ConfigProvider>
                                        </div>
                                    </div>
                                </Col>
                            </>
                        )
                    }
                    
                </Row>
            </ConfigProvider>
            {
                ((getDataLoading && currentPage != 1) || deleteLoading) && (
                    <LoadingModal 
                        open={getDataLoading || deleteLoading}
                        message={`${getDataLoading ? "Đang lấy dữ liệu" : "Đang xóa"}`}
                    />
                )
            }
        </>
    )
}

export default Cart;