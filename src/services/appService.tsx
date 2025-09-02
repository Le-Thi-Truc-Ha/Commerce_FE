import axios from "../configs/axios";
import type { BackendResponse, GoogleUser } from "../interfaces/appInterface";

const reloadPageApi = (): Promise<BackendResponse> => {
    return axios.get("/reload-page");
}

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

const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

export default {
    reloadPageApi, googleLoginApi, normalLoginApi, logoutApi
}