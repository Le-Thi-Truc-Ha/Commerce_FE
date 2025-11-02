import type { Dispatch, SetStateAction } from "react";
import axios from "../configs/axios";
import type { UserType } from "../configs/globalVariable";
import { messageService, type BackendResponse } from "../interfaces/appInterface";
import type { AddressInformation, CartProduct, FavouriteListProps, RawFavourite } from "../interfaces/customerInterface";
import type { NavigateFunction } from "react-router-dom";
import axiosPackage from "axios";

export const getAccountInformationApi = (accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-account-information?accountId=${accountId}`)
}

export const saveInformationApi = (accountId: number, name: string, email: string, dob: string | null, gender: string | null): Promise<BackendResponse> => {
    return axios.post("/customer/save-information", {
        accountId, name, email, dob, gender
    })
}

export const savePasswordApi = (accountId: number, oldPassword: string, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/customer/save-password", {
        accountId, oldPassword, newPassword
    })
}

export const createAddressApi = (accountId: number, name: string, phone: string, address: string, isDefault: boolean, longitude: number, latitude: number): Promise<BackendResponse> => {
    return axios.post("/customer/create-address", {
        accountId, name, phone, address, isDefault, longitude, latitude
    })
}

export const getAllAddressApi = (accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-all-address?accountId=${accountId}`)
}

export const getAddressApi = (addressId: number, accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-address?addressId=${addressId}&accountId=${accountId}`)
}

export const updateAddressApi = (addressId: number, accountId: number, name: string, phone: string, address: string, isDefault: boolean, longitude: number, latitude: number): Promise<BackendResponse> => {
    return axios.post("/customer/update-address", {
        addressId, accountId, name, phone, address, isDefault, longitude, latitude
    })
}

export const deleteAddressApi = (accountId: number, idDelete: number[]): Promise<BackendResponse> => {
    return axios.post("/customer/delete-address", {
        accountId, idDelete
    })
}

export const addFavouriteApi = (accountId: number, productId: number): Promise<BackendResponse> => {
    return axios.post("/customer/add-favourite", {
        accountId, productId
    })
}

export const deleteFavouriteApi = (accountId: number, productId: number, take: number): Promise<BackendResponse> => {
    return axios.post("/customer/delete-favourite", {
        accountId, productId, take
    })
}

export const getFavouriteListApi = (accountId: number, currentPage: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-all-favourite?accountId=${accountId}&page=${currentPage}`)
}

export const getHistoryListApi = (accountId: number, currentPage: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-all-history?accountId=${accountId}&page=${currentPage}`)
}

export const addCartApi = (accountId: number, productId: number[], productVariantId: number[], quantity: number[], now: string): Promise<BackendResponse> => {
    return axios.post("/customer/add-cart", {
        accountId, productId, productVariantId, quantity, now
    })
}

export const getProductInCartApi = (accountId: number, page: number): Promise<BackendResponse> => {
    return axios.post("/customer/get-product-in-cart", {
        accountId, page
    })
}

export const updateQuantityCartApi = (quantityCart: {cartId: number, quantityUpdate: number}[], now: string): Promise<BackendResponse> => {
    return axios.post("/customer/update-quantity-cart", {
        quantityCart, now
    })
}

export const deleteProductInCartApi = (cartId: number[], productId: number[], take: number, now: string): Promise<BackendResponse> => {
    return axios.post("/customer/delete-product-in-cart", {
        cartId, productId, take, now
    })
}

export const getProductDetailModalApi = (accountId: number, productId: number): Promise<BackendResponse> => {
    return axios.post("/customer/get-product-detail-modal", {
        accountId, productId
    })
}

export const updateVariantInCartApi = (cartId: number, accountId: number, variantId: number, quantity: number, now: string): Promise<BackendResponse> => {
    return axios.post("/customer/update-variant-in-cart", {
        cartId, accountId, variantId, quantity, now
    })
}

export const getAddressAndFeeApi = (accountId: number): Promise<BackendResponse> => {
    return axios.post("/customer/get-address-and-fee", {
        accountId
    })
}

export const getVoucherApi = (accountId: number, productId: number[], totalPrice: number): Promise<BackendResponse> => {
    return axios.post("/customer/get-voucher", {
        accountId, productId, totalPrice
    })
}

export const orderProductApi = (
    accountId: number, productOrder: CartProduct[], address: AddressInformation,
    totalPrice: number, orderDate: string, note: string, 
    voucherUse: {
        productVoucher: {voucherId: number, voucherCode: string, productId: number[]} | null,
        shipVoucher: {voucherId: number, voucherCode: string} | null 
    }, 
    shippingFeeId: number, paymentMethod: number, finalPrice: number
): Promise<BackendResponse> => {
    return axios.post("/customer/order-product", {
        accountId, productOrder, address, totalPrice, orderDate, note, voucherUse, shippingFeeId, paymentMethod, finalPrice
    })
}

export const getOrderListApi = (accountId: number, status: number[], page: number): Promise<BackendResponse> => {
    return axios.post("/customer/get-order-list", {
        accountId, status, page
    })
}

export const getOrderDetailApi = (accountId: number, orderId: number): Promise<BackendResponse> => {
    return axios.post("/customer/get-order-detail", {
        accountId, orderId
    })
}

export const confirmReceiveProductApi = (orderId: number, now: string): Promise<BackendResponse> => {
    return axios.post("/customer/confirm-receive-product", {
        orderId, now
    })
}

export const returnProductApi = (orderId: number, take: number, now: string, accountId: number, status: number[], reason: string, mode: string, productId: number[], productVariantId: number[], quantity: number[]): Promise<BackendResponse> => {
    return axios.post("/customer/return-product", {
        orderId, take, now, accountId, status, reason, mode, productId, productVariantId, quantity
    })
}

export const favouriteDataProcess = (rawData: RawFavourite[]): FavouriteListProps[] => {
    let result: FavouriteListProps[] = [];
    const categoriesPath: string[] = ["shirt", "pant", "dress", "skirt"]
    
    result = rawData.map((item) => {
        const percent = item.product.productPromotions.find((promotionItem) => (promotionItem.promotion != null))?.promotion?.percent ?? null;
        
        return({
            id: item.id,
            productCard: {
                productId: item.product.id,
                url: item.product.medias[0].url,
                name: item.product.name,
                star: item.product.rateStar ? item.product.rateStar : 0,
                price: item.product.productVariants[0].price,
                discount: percent ? `${(Math.round((item.product.productVariants[0].price * ((100 - percent) / 100)) / 1000) * 1000).toLocaleString("en-US")}đ` : null,
                category: item.product.category.parentId ? categoriesPath[item.product.category.parentId - 1] : categoriesPath[item.product.category.id - 1],
                isLike: item.product.favourites.length > 0 ? true : false,
                status: item.product.status,
                saleFigure: item.product.saleFigure
            }
        })
    })
    return result;
}

export const addFavourite = async (
    user: UserType, 
    setLoading: Dispatch<SetStateAction<boolean>>, 
    productId: number, 
    setIsLikeState: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction,
    setPathBeforeLogin: (value: string) => void
) => {
    if (user.isAuthenticated) {
        setLoading(true)
        try {
            const result: BackendResponse = await addFavouriteApi(user.accountId, productId)
            setLoading(false);
            if (result.code == 0) {
                setIsLikeState(true);
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server")
        } finally {
            setLoading(false);
        }
    } else {
        navigate("/login");
        setPathBeforeLogin(location.pathname);
    }
}

export const deleteFavourite = async (
    user: UserType, 
    setLoading: Dispatch<SetStateAction<boolean>>, 
    productId: number, 
    setIsLikeState: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction,
    setPathBeforeLogin: (value: string) => void
) => {
    if (user.isAuthenticated) {
        setLoading(true);
        try {
            const result: BackendResponse = await deleteFavouriteApi(user.accountId, productId, -1)
            setLoading(false);
            if (result.code == 0) {
                setIsLikeState(false);
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server")
        } finally {
            setLoading(false);
        }
    } else {
        navigate("/login");
        setPathBeforeLogin(location.pathname);
    }
}

export const addCart = async (
    user: UserType,
    sizeSelect: string[],
    colorSelect: string[],
    variantId: number[],
    quantitySelect: number[],
    productId: number[],
    setCart: Dispatch<SetStateAction<number>>,
    setPathBeforeLogin: (value: string) => void,
    navigate: NavigateFunction,
    setModalLoading: Dispatch<SetStateAction<boolean>>,
    now: string,
    buyAgain: boolean
) => {
    if (user.isAuthenticated) {
        if (sizeSelect.length > 0 && sizeSelect.find((item) => (item == "")) || colorSelect.length > 0 && colorSelect.find((item) => (item == ""))) {
            messageService.error("Chọn phân loại sản phẩm")
        } else {
            setModalLoading(true);
            try {
                const result: BackendResponse = await addCartApi(user.accountId, productId, variantId, quantitySelect, now);
                setModalLoading(false);
                if (result.code == 0) {
                    messageService.success(result.message);
                    if (result.data) {
                        setCart(prev => prev + variantId.length)
                    }
                    if (buyAgain) {
                        navigate("/customer/cart")
                    }
                } else if (result.code == 2) {
                    messageService.error(result.message);
                    navigate("/")
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setModalLoading(false)
            }
        }
    } else {
        setPathBeforeLogin(location.pathname);
        navigate("/login")
    }
}

export const getCoordinates = async (address: string) => {
    const res = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&country=VN&language=vi&limit=1&access_token=${import.meta.env.VITE_MB_API_KEY}`,
        {
            method: "GET",
            headers:{
                Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
        }
    )
    const data = await res.json();
    const [longitude, latitude] = data.features[0].geometry.coordinates;
    return {longitude, latitude}
}

export const getCity = async (setCityList: Dispatch<SetStateAction<any[]>>) => {
    try {
        const result = await axiosPackage.get("https://provinces.open-api.vn/api/p/");
        setCityList(result.data);
        return result.data
    } catch(e) {
        console.log(e);
        messageService.error("Xảy ra lỗi trong quá trình lấy dữ liệu")
    }
}

export const getDistrict = async (cityCode: number, setDistrictList: Dispatch<SetStateAction<any[]>>, setRegionObj: Dispatch<SetStateAction<{cityCode: number | null, districtCode: number | null, wardCode: number | null}>>): Promise<any> => {
    try {
        const result = await axiosPackage.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
        setDistrictList(result.data.districts);
        setRegionObj(prev => ({...prev, districtCode: null, wardCode: null}))
        return result.data.districts;
    } catch(e) {
        console.log(e);
        messageService.error("Xảy ra lỗi trong quá trình lấy dữ liệu")
    }
}

export const getWard = async (districtCode: number, setWardList: Dispatch<SetStateAction<any[]>>, setRegionObj: Dispatch<SetStateAction<{cityCode: number | null, districtCode: number | null, wardCode: number | null}>>): Promise<any> => {
    try {
        const result = await axiosPackage.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        setWardList(result.data.wards);
        setRegionObj(prev => ({...prev, wardCode: null}))
        return result.data.wards;
    } catch(e) {
        console.log(e);
        messageService.error("Xảy ra lỗi trong quá trình lấy dữ liệu")
    }
}