import axios from "../configs/axios";

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
    }
};
