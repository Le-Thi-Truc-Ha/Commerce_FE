import type { Dayjs } from "dayjs";
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

const checkOtpApi = (email: string, otp: string): Promise<BackendResponse> => {
    return axios.post("/check-opt", {
        email, otp
    })
}

const resetPasswordApi = (email: string, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/reset-password", {
        email, newPassword
    })
}

const verifyEmailApi = (email: string): Promise<BackendResponse> => {
    return axios.post("/verify-email", {
        email
    });
}

const createAccountApi = (
    otp: string, email: string, name: string, dob: string | null,
    gender: string | null, password: string
): Promise<BackendResponse> => {
    return axios.post("/create-account", {
        otp, email, name, dob, gender, password
    })
}

export default {
    reloadPageApi, googleLoginApi, normalLoginApi, logoutApi, checkEmailApi,
    checkOtpApi, resetPasswordApi, verifyEmailApi, createAccountApi
}