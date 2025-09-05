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

const normalLoginApi = (email: string, password: string): Promise<BackendResponse> => {
    return axios.post("/normal-login", {
        email, password
    });
};

const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

const checkEmailApi = (email: string): Promise<BackendResponse> => {
    return axios.post("/check-email", {
        email
    });
}

export default {
    reloadPageApi, googleLoginApi, normalLoginApi, logoutApi, checkEmailApi
}