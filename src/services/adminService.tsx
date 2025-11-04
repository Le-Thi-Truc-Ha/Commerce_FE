import axios from "../configs/axios";
import type { BackendResponse } from "../interfaces/appInterface";

export const dashboardApi = {
    async getRecentOrders() {
        return axios.get("/admin/recent-orders");
    },
    async getSalesData() {
        return axios.get("/admin/sales-data");
    },
    async getCategoriesSale() {
        return axios.get("/admin/categories-sale");
    },
};

export const productApi = {
    async getAll(page: number, limit: number, search?: string, category?: string, price?: string) {
        return await axios.get("/admin/products", { params: { page, limit, search, category, price }});
    },
    async getById(id: number) {
        return axios.get("/admin/product-id", { params: { id }});
    },
    async getDetail(id: number) {
        return axios.get("/admin/product-detail", { params: { id }});
    },
    async getCategories() {
        return axios.get("/admin/product-categories");
    },
    async create(formData: FormData) {
        return axios.post("/admin/create-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    async update(formData: FormData) {
        return axios.put("/admin/update-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    async delete(id: number) {
        return axios.delete("/admin/delete-product", { params: { id }});
    },
};

export const variantApi = {
    async getAllVariant(id: number, page: number, limit: number) {
        return axios.get("/admin/product-variants", { params: { id, page, limit }});
    },
    async getById(id: number) {
        return axios.get("/admin/variant-id", { params: { id } });
    },
    async create(formData: FormData) {
        return axios.post("/admin/create-variant", formData);
    },
    async update(formData: FormData) {
        return axios.put("/admin/update-variant", formData);
    },
    async delete(id: number) {
        return axios.delete("/admin/delete-variant", { params: { id } });
    }
};

export const orderApi = {
    async getStatus() {
        return axios.get("/admin/status");
    },
    async getAll(page: number, limit: number, search?: string, fromDate?: string, toDate?: string, status?: number) {
        return axios.get("/admin/orders", { params: { page, limit, search, fromDate, toDate, status } });
    },
    async getBill(id: number) {
        return axios.get("/admin/bill", { params: { id }});
    },
    async getHistories(id: number) {
        return axios.get("/admin/order-histories", { params: { id }});
    },
    async update(id: number, status: number, note?: string) {
        return axios.get("/admin/order-update-status", { params: { id, status, note }});
    }
};

export const customerApi = {
    async getAll(page: number, limit: number, search?: string) {
        return axios.get("/admin/customers", { params: { page, limit, search }});
    },
    async getDetail(id: number) {
        return axios.get("/admin/customer-detail", { params: { id }});
    },
    async getOrders(id: number, page: number, limit: number) {
        return axios.get("/admin/customer-orders", { params: { id, page, limit }});
    }
};

export const promotionApi = {
    async getAll(page: number, limit: number, search?: string, fromDate?: string, toDate?: string ) {
        return axios.get("/admin/promotions", { params: { page, limit, search, fromDate, toDate } });
    }, 
    async getProducts(promotionId: number, page: number, limit: number, search?: string ) {
        return axios.get("/admin/promotion-products", { params: { promotionId, page, limit, search } });
    },
    async getById(id: number) {
        return axios.get("/admin/promotion-id", { params: { id } });
    },
    async getProductsByCategory(categoryId: number, search: string) {
        return axios.get("/admin/promotion-products-category", { params: { categoryId, search }});
    },
    async create(formData: FormData) {
        return axios.post("/admin/create-promotion", formData);
    },
    async update(formData: FormData) {
        return axios.put("/admin/update-promotion", formData);
    },
    async delete(id: number) {
        return axios.delete("/admin/delete-promotion", { params: { id } });
    }
};

export const voucherApi = {
    async getAll(page: number, limit: number, search?: string, fromDate?: string, toDate?: string, type?: number) {
        return axios.get("/admin/vouchers", { params: { page, limit, search, fromDate, toDate, type } });
    },
    async getDetail(id: number, page: number, limit: number) {
        return axios.get("/admin/voucher-detail", { params: { id, page, limit } });
    },
    async getById(id: number) {
        return axios.get("/admin/voucher-id", { params: { id } });
    },
    async getCategories(search: string) {
        return axios.get("/admin/voucher-categories", { params: { search }});
    },
    async create(formData: FormData) {
        return axios.post("/admin/create-voucher", formData);
    },
    async update(formData: FormData) {
        return axios.put("/admin/update-voucher", formData);
    },
    async delete(id: number) {
        return axios.delete("/admin/delete-voucher", { params: { id } });
    }
};

export const categoryApi = {
    async getAll(page: number, limit: number, search?: string) {
        return axios.get("/admin/categories", { params: { page, limit, search } });
    },
    async create(formData: FormData) {
        return axios.post("/admin/create-category", formData);
    },
    async update(formData: FormData) {
        return axios.put("/admin/update-category", formData);
    },
    async delete(id: number) {
        return axios.delete("/admin/delete-category", { params: { id } });
    }
};

export const feedbackApi = {
    async getAll(page: number, limit: number, search?: string, star?: number, fromDate?: string, toDate?: string) {
        return axios.get("/admin/feedbacks", { params: { page, limit, search, star, fromDate, toDate } });
    },
};

export const savePasswordApi = (accountId: number, oldPassword: string, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/admin/save-password", {
        accountId, oldPassword, newPassword
    })
}