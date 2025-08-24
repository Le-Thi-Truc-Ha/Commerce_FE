import axios from "axios";
import type { BackendResponse } from "../interfaces/appInterface";

const loginApi = (username: string, password: string): Promise<BackendResponse> => {
    return axios.post("/login", {
        username, password
    });
};

const reloadPageApi = (): Promise<BackendResponse> => {
    return axios.get("/reload-page");
}

const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

export default {
    loginApi, reloadPageApi, logoutApi
}