import axios from "../configs/axios";
import type { BackendResponse } from "../interfaces/appInterface";

const getAccountInformationApi = (accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-account-information?accountId=${accountId}`)
}

const saveInformationApi = (accountId: number, name: string, email: string, dob: string | null, gender: string | null): Promise<BackendResponse> => {
    return axios.post("/customer/save-information", {
        accountId, name, email, dob, gender
    })
}

const savePasswordApi = (accountId: number, oldPassword: string, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/customer/save-password", {
        accountId, oldPassword, newPassword
    })
}

const createAddressApi = (accountId: number, name: string, phone: string, address: string, isDefault: boolean): Promise<BackendResponse> => {
    return axios.post("/customer/create-address", {
        accountId, name, phone, address, isDefault
    })
}

const getAllAddressApi = (accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-all-address?accountId=${accountId}`)
}

const getAddressApi = (addressId: number, accountId: number): Promise<BackendResponse> => {
    return axios.get(`/customer/get-address?addressId=${addressId}&accountId=${accountId}`)
}

const updateAddressApi = (addressId: number, accountId: number, name: string, phone: string, address: string, isDefault: boolean): Promise<BackendResponse> => {
    return axios.post("/customer/update-address", {
        addressId, accountId, name, phone, address, isDefault
    })
}

const deleteAddressApi = (accountId: number, idDelete: number[]): Promise<BackendResponse> => {
    return axios.post("/customer/delete-address", {
        accountId, idDelete
    })
}

export default {
    getAccountInformationApi, saveInformationApi, savePasswordApi, createAddressApi,
    getAllAddressApi, getAddressApi, updateAddressApi, deleteAddressApi
}