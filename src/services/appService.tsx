import type { Dayjs } from "dayjs";
import axios from "../configs/axios";
import type { BackendResponse, GoogleUser, ProductionCardProps, RawProduction } from "../interfaces/appInterface";

export const reloadPageApi = (): Promise<BackendResponse> => {
    return axios.get("/reload-page");
}

export const googleLoginApi = (userInformation: GoogleUser): Promise<BackendResponse> => {
    return axios.post("/google-login", {
        userInformation
    })
}

export const normalLoginApi = (email: string, password: string): Promise<BackendResponse> => {
    return axios.post("/normal-login", {
        email, password
    });
};

export const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

export const checkEmailApi = (email: string): Promise<BackendResponse> => {
    return axios.post("/check-email", {
        email
    });
}

export const checkOtpApi = (email: string, otp: string): Promise<BackendResponse> => {
    return axios.post("/check-opt", {
        email, otp
    })
}

export const resetPasswordApi = (email: string, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/reset-password", {
        email, newPassword
    })
}

export const verifyEmailApi = (email: string): Promise<BackendResponse> => {
    return axios.post("/verify-email", {
        email
    });
}

export const createAccountApi = (
    otp: string, email: string, name: string, dob: string | null,
    gender: string | null, password: string
): Promise<BackendResponse> => {
    return axios.post("/create-account", {
        otp, email, name, dob, gender, password
    })
}

export const getBestSellerApi = (accountId: number): Promise<BackendResponse> => {
    return axios.get(`/get-best-seller?accountId=${accountId}`);
}

export const getProductApi = (accountId: number, nowCategory: number, nowSort: number, nowPage: number): Promise<BackendResponse> => {
    return axios.post("/get-product", {
        accountId, nowCategory, nowSort, nowPage
    })
}

export const getProductDetailApi = (accountId: number, productId: number, pageRate: number): Promise<BackendResponse> => {
    return axios.post("/get-product-detail", {
        accountId, productId, pageRate
    })
}

export const saveHistoryApi = (accountId: number, productId: number, now: string): Promise<BackendResponse> => {
    return axios.post("/save-history", {
        accountId, productId, now
    })
}

export const checkUpdateCartApi = (cartId: number): Promise<BackendResponse> => {
    return axios.post("/check-update-cart", {
        cartId
    })
}

export const findProductApi = (findValue: string, productId: number[] | null, currentPage: number): Promise<BackendResponse> => {
    return axios.post("/find-product", {
        findValue, productId, currentPage
    })
}

export const productDataProcess = (rawData: RawProduction[]): ProductionCardProps[] => {
    let result: ProductionCardProps[] = [];
    const categoriesPath: string[] = ["shirt", "pant", "dress", "skirt"]

    result = rawData.map((item) => {
        const percent = item.productPromotions.find((promotionItem) => (promotionItem.promotion != null))?.promotion?.percent ?? null;
        return({
            productId: item.id,
            url: item.medias[0].url,
            name: item.name,
            star: item.rateStar ? item.rateStar : 0,
            price: item.productVariants[0].price,
            discount: percent ? `${(Math.round((item.productVariants[0].price * ((100 - percent) / 100)) / 1000) * 1000).toLocaleString("en-US")}đ` : null,
            category: item.category.parentId ? categoriesPath[item.category.parentId - 1] : categoriesPath[item.category.id - 1],
            isLike: item.favourites.length > 0 ? true : false,
            status: item.status,
            saleFigure: item.saleFigure
        })
    })
    return result;
}