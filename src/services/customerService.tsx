import axios from "../configs/axios";
import type { BackendResponse } from "../interfaces/appInterface";
import type { FavouriteListProps, RawFavourite } from "../interfaces/customerInterface";

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

export const createAddressApi = (accountId: number, name: string, phone: string, address: string, isDefault: boolean): Promise<BackendResponse> => {
    return axios.post("/customer/create-address", {
        accountId, name, phone, address, isDefault
    })
}

export const getAllAddressApi = (accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-all-address?accountId=${accountId}`)
}

export const getAddressApi = (addressId: number, accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-address?addressId=${addressId}&accountId=${accountId}`)
}

export const updateAddressApi = (addressId: number, accountId: number, name: string, phone: string, address: string, isDefault: boolean): Promise<BackendResponse> => {
    return axios.post("/customer/update-address", {
        addressId, accountId, name, phone, address, isDefault
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
                isLike: true,
                status: item.product.status,
                saleFigure: item.product.saleFigure
            }
        })
    })
    return result;
}