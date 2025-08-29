import axios from "../configs/axios";
import type { BackendResponse, GoogleUser } from "../interfaces/appInterface";

const googleLoginApi = (userInformation: GoogleUser): Promise<BackendResponse> => {
    return axios.post("/google-login", {
        userInformation
    })
}

const normalLoginApi = (username: string, password: string): Promise<BackendResponse> => {
    return axios.post("/login", {
        username, password
    });
};

const reloadPageApi = (googleLogin: boolean): Promise<BackendResponse> => {
    return axios.get(`/reload-page?googleLogin=${googleLogin}`);
}

const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

export default {
    googleLoginApi, normalLoginApi, reloadPageApi, logoutApi
}